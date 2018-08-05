import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { NonFunctionProperties, Omit } from '../../util';
import { PredicateTemplate } from '../predicate-template';
import { ResponseGeneratorTemplate } from '../response-generator-template';
import { ChildPredicateNodeAdded } from './child-predicate-node-added';
import { PredicateNodeCreated } from './predicate-node-created';
import { ResponseGeneratorSet } from './response-generator-set';
import {
  isPredicateCustomPropertes,
  isResponseGeneratorCustomPropertes,
  PredicateCustomProperties,
  PredicateTemplateInfo,
  ResponseGeneratorCustomProperties,
  ResponseGeneratorTemplateInfo,
} from './template-info-or-custom-properties';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  | ChildPredicateNodeAdded
  ;

export interface ResponseGenerator {
  name: string;
  templateInfoOrCustomProperties: ResponseGeneratorTemplateInfo | ResponseGeneratorCustomProperties;
}

export class PredicateNode extends EventSourcedRootEntity<DomainEvents> {
  name: string;
  templateInfoOrCustomProperties: PredicateTemplateInfo | PredicateCustomProperties;
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    name: string,
    description: string,
    templateInfoOrCustomProperties: {
      template: PredicateTemplate;
      parameterValues: { [prop: string]: string | number | boolean };
    } | PredicateCustomProperties,
    parentNodeId: string | undefined,
  ) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: `predicate/${uuid()}`,
      name,
      description,
      templateInfoOrCustomProperties:
        isPredicateCustomPropertes(templateInfoOrCustomProperties)
          ? templateInfoOrCustomProperties
          : {
            templateSnapshot: {
              templateId: templateInfoOrCustomProperties.template.id,
              version: templateInfoOrCustomProperties.template.unmutatedVersion,
              name: templateInfoOrCustomProperties.template.name,
              description: templateInfoOrCustomProperties.template.description,
              evalFunctionBody: templateInfoOrCustomProperties.template.evalFunctionBody,
              parameters: templateInfoOrCustomProperties.template.parameters,
            },
            parameterValues: templateInfoOrCustomProperties.parameterValues,
          },
      parentNodeId,
    }));
  }

  setResponseGenerator(
    responseGeneratorName: string,
    responseGeneratorDescription: string,
    templateInfoOrCustomProperties: {
      template: ResponseGeneratorTemplate;
      parameterValues: { [prop: string]: string | number | boolean };
    } | ResponseGeneratorCustomProperties,
  ) {
    if (Array.isArray(this.childNodeIdsOrResponseGenerator) && this.childNodeIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child nodes!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateNodeId: this.id,
      responseGeneratorName,
      responseGeneratorDescription,
      templateInfoOrCustomProperties:
        isResponseGeneratorCustomPropertes(templateInfoOrCustomProperties)
          ? templateInfoOrCustomProperties
          : {
            templateSnapshot: {
              templateId: templateInfoOrCustomProperties.template.id,
              version: templateInfoOrCustomProperties.template.unmutatedVersion,
              name: templateInfoOrCustomProperties.template.name,
              description: templateInfoOrCustomProperties.template.description,
              generatorFunctionBody: templateInfoOrCustomProperties.template.generatorFunctionBody,
              parameters: templateInfoOrCustomProperties.template.parameters,
            },
            parameterValues: templateInfoOrCustomProperties.parameterValues,
          },
    }));
  }

  addChildPredicate(
    childNodeId: string,
  ) {
    if (!!this.childNodeIdsOrResponseGenerator && !!(this.childNodeIdsOrResponseGenerator as ResponseGenerator).templateInfoOrCustomProperties) {
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
      this.templateInfoOrCustomProperties = event.templateInfoOrCustomProperties;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childNodeIdsOrResponseGenerator = {
        name: event.responseGeneratorName,
        templateInfoOrCustomProperties: event.templateInfoOrCustomProperties,
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
      templateInfoOrCustomProperties: this.templateInfoOrCustomProperties,
      childNodeIdsOrResponseGenerator: this.childNodeIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, DomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
}
