import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { NonFunctionProperties, Omit } from '../../util';
import { PredicateTemplate } from '../predicate-template';
import { ResponseGeneratorTemplate } from '../response-generator-template';
import { ChildPredicateNodeAdded } from './child-predicate-node-added';
import { PredicateNodeCreated } from './predicate-node-created';
import { PredicateTemplateSnapshot } from './predicate-template-snapshot';
import { ResponseGeneratorSet } from './response-generator-set';
import { ResponseGeneratorTemplateSnapshot } from './response-generator-template-snapshot';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  | ChildPredicateNodeAdded
  ;

export interface ResponseGenerator {
  name: string;
  templateInstanceOrGeneratorFunctionBody: {
    templateSnapshot: ResponseGeneratorTemplateSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
}

export class PredicateNode extends EventSourcedRootEntity<DomainEvents> {
  name: string;
  templateInstanceOrEvalFunctionBody: {
    templateSnapshot: PredicateTemplateSnapshot;
    parameterValues: { [prop: string]: string | number | boolean };
  } | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    name: string,
    templateInstanceOrEvalFunctionBody: {
      template: PredicateTemplate;
      parameterValues: { [prop: string]: string | number | boolean };
    } | string,
    parentNodeId: string | undefined,
  ) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: `predicate/${uuid()}`,
      name,
      templateInstanceOrEvalFunctionBody:
        typeof templateInstanceOrEvalFunctionBody === 'string'
          ? templateInstanceOrEvalFunctionBody
          : {
            templateSnapshot: {
              templateId: templateInstanceOrEvalFunctionBody.template.id,
              version: templateInstanceOrEvalFunctionBody.template.unmutatedVersion,
              name: templateInstanceOrEvalFunctionBody.template.name,
              description: templateInstanceOrEvalFunctionBody.template.description,
              evalFunctionBody: templateInstanceOrEvalFunctionBody.template.evalFunctionBody,
              parameters: templateInstanceOrEvalFunctionBody.template.parameters,
            },
            parameterValues: templateInstanceOrEvalFunctionBody.parameterValues,
          },
      parentNodeId,
    }));
  }

  setResponseGenerator(
    responseGeneratorName: string,
    templateInstanceOrGeneratorFunctionBody: {
      template: ResponseGeneratorTemplate;
      parameterValues: { [prop: string]: string | number | boolean };
    } | string,
  ) {
    if (Array.isArray(this.childNodeIdsOrResponseGenerator) && this.childNodeIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child nodes!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateNodeId: this.id,
      responseGeneratorName,
      templateInstanceOrGeneratorFunctionBody:
        typeof templateInstanceOrGeneratorFunctionBody === 'string'
          ? templateInstanceOrGeneratorFunctionBody
          : {
            templateSnapshot: {
              templateId: templateInstanceOrGeneratorFunctionBody.template.id,
              version: templateInstanceOrGeneratorFunctionBody.template.unmutatedVersion,
              name: templateInstanceOrGeneratorFunctionBody.template.name,
              description: templateInstanceOrGeneratorFunctionBody.template.description,
              generatorFunctionBody: templateInstanceOrGeneratorFunctionBody.template.generatorFunctionBody,
              parameters: templateInstanceOrGeneratorFunctionBody.template.parameters,
            },
            parameterValues: templateInstanceOrGeneratorFunctionBody.parameterValues,
          },
    }));
  }

  addChildPredicate(
    childNodeId: string,
  ) {
    if (!!this.childNodeIdsOrResponseGenerator && !!(this.childNodeIdsOrResponseGenerator as ResponseGenerator).templateInstanceOrGeneratorFunctionBody) {
      throw new Error(`Cannot add child predicate node for predicate node ${this.id} since it already has a response generator set!`);
    }

    return this.apply(ChildPredicateNodeAdded.create({
      parentNodeId: this.id,
      childNodeId,
    }));
  }

  EVENT_HANDLERS: EventHandlerMap<DomainEvents> = {
    [PredicateNodeCreated.KIND]: event => {
      this.id = event.nodeId;
      this.name = event.name;
      this.templateInstanceOrEvalFunctionBody = event.templateInstanceOrEvalFunctionBody;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childNodeIdsOrResponseGenerator = {
        name: event.responseGeneratorName,
        templateInstanceOrGeneratorFunctionBody: event.templateInstanceOrGeneratorFunctionBody,
      };
    },
    [ChildPredicateNodeAdded.KIND]: event => {
      if (!Array.isArray(this.childNodeIdsOrResponseGenerator)) {
        this.childNodeIdsOrResponseGenerator = [];
      }

      this.childNodeIdsOrResponseGenerator.push(event.childNodeId);
    },
  };

  getSnapshotValue(): NonFunctionProperties<Omit<PredicateNode, keyof EventSourcedRootEntity<DomainEvents> | 'getSnapshotValue'>> {
    return {
      name: this.name,
      templateInstanceOrEvalFunctionBody: this.templateInstanceOrEvalFunctionBody,
      childNodeIdsOrResponseGenerator: this.childNodeIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, DomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
}
