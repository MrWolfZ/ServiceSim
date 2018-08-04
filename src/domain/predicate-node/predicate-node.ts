import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateTemplate } from '../predicate-kind';
import { ResponseGeneratorTemplate } from '../response-generator-kind';
import { ChildPredicateNodeAdded } from './child-predicate-node-added';
import { PredicateTemplateVersionSnapshot } from './predicate-kind-version-snapshot';
import { PredicateNodeCreated } from './predicate-node-created';
import { ResponseGeneratorTemplateVersionSnapshot } from './response-generator-kind-version-snapshot';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  | ChildPredicateNodeAdded
  ;

export interface ResponseGenerator {
  templateVersionSnapshot: ResponseGeneratorTemplateVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
}

export class PredicateNode extends EventSourcedRootEntity<DomainEvents> {
  predicateTemplateVersionSnapshot: PredicateTemplateVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean } = {};
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    predicateTemplate: PredicateTemplate,
    parameterValues: { [prop: string]: string | number | boolean } = {},
    parentNodeId: string | undefined,
  ) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: `predicate/${uuid()}`,
      predicateTemplateVersionSnapshot: {
        templateId: predicateTemplate.id,
        version: predicateTemplate.unmutatedVersion,
        name: predicateTemplate.name,
        description: predicateTemplate.description,
        evalFunctionBody: predicateTemplate.evalFunctionBody,
        parameters: predicateTemplate.parameters,
      },
      parameterValues,
      parentNodeId,
    }));
  }

  setResponseGenerator(
    responseGeneratorTemplate: ResponseGeneratorTemplate,
    parameterValues: { [prop: string]: string | number | boolean },
  ) {
    if (Array.isArray(this.childNodeIdsOrResponseGenerator) && this.childNodeIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child nodes!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateNodeId: this.id,
      responseGeneratorTemplateVersionSnapshot: {
        templateId: responseGeneratorTemplate.id,
        version: responseGeneratorTemplate.unmutatedVersion,
        name: responseGeneratorTemplate.name,
        description: responseGeneratorTemplate.description,
        generatorFunctionBody: responseGeneratorTemplate.generatorFunctionBody,
        parameters: responseGeneratorTemplate.parameters,
      },
      parameterValues,
    }));
  }

  addChildPredicate(
    childNodeId: string,
  ) {
    if (!!this.childNodeIdsOrResponseGenerator && !!(this.childNodeIdsOrResponseGenerator as ResponseGenerator).templateVersionSnapshot) {
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
      this.predicateTemplateVersionSnapshot = event.predicateTemplateVersionSnapshot;
      this.parameterValues = event.parameterValues;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childNodeIdsOrResponseGenerator = {
        templateVersionSnapshot: event.responseGeneratorTemplateVersionSnapshot,
        parameterValues: event.parameterValues,
      };
    },
    [ChildPredicateNodeAdded.KIND]: event => {
      if (!Array.isArray(this.childNodeIdsOrResponseGenerator)) {
        this.childNodeIdsOrResponseGenerator = [];
      }

      this.childNodeIdsOrResponseGenerator.push(event.childNodeId);
    },
  };

  getSnapshotValue() {
    return {
      predicateTemplateVersionSnapshot: this.predicateTemplateVersionSnapshot,
      parameters: this.parameterValues,
      childPredicateIdsOrResponseGeneratorId: this.childNodeIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, DomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
}
