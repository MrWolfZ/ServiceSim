import uuid from 'uuid';

import { EventHandlerMap, EventSourcedEntityRepository, EventSourcedRootEntity } from '../../infrastructure';
import { PredicateKind } from '../predicate-kind';
import { ResponseGeneratorKind } from '../response-generator-kind';
import { ChildPredicateNodeAdded } from './child-predicate-node-added';
import { PredicateKindVersionSnapshot } from './predicate-kind-version-snapshot';
import { PredicateNodeCreated } from './predicate-node-created';
import { ResponseGeneratorKindVersionSnapshot } from './response-generator-kind-version-snapshot';
import { ResponseGeneratorSet } from './response-generator-set';

const JOURNAL_NAME = 'predicate/Journal';

type DomainEvents =
  | PredicateNodeCreated
  | ResponseGeneratorSet
  | ChildPredicateNodeAdded
  ;

export interface ResponseGenerator {
  versionSnapshot: ResponseGeneratorKindVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean };
}

export class PredicateNode extends EventSourcedRootEntity<DomainEvents> {
  predicateKindVersionSnapshot: PredicateKindVersionSnapshot;
  parameterValues: { [prop: string]: string | number | boolean } = {};
  childNodeIdsOrResponseGenerator: string[] | ResponseGenerator | undefined;

  static create(
    predicateKind: PredicateKind,
    parameterValues: { [prop: string]: string | number | boolean } = {},
    parentPredicateNodeId: string | undefined,
  ) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: `predicate/${uuid()}`,
      predicateKindVersionSnapshot: {
        predicateKindId: predicateKind.id,
        version: predicateKind.unmutatedVersion,
        name: predicateKind.name,
        description: predicateKind.description,
        evalFunctionBody: predicateKind.evalFunctionBody,
        parameters: predicateKind.parameters,
      },
      parameterValues,
      parentPredicateNodeId,
    }));
  }

  setResponseGenerator(
    responseGeneratorKind: ResponseGeneratorKind,
    parameterValues: { [prop: string]: string | number | boolean },
  ) {
    if (Array.isArray(this.childNodeIdsOrResponseGenerator) && this.childNodeIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child nodes!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      predicateNodeId: this.id,
      responseGeneratorKindVersionSnapshot: {
        responseGeneratorKindId: responseGeneratorKind.id,
        version: responseGeneratorKind.unmutatedVersion,
        name: responseGeneratorKind.name,
        description: responseGeneratorKind.description,
        generatorFunctionBody: responseGeneratorKind.generatorFunctionBody,
        parameters: responseGeneratorKind.parameters,
      },
      parameterValues,
    }));
  }

  addChildPredicate(
    childNodeId: string,
  ) {
    if (!!this.childNodeIdsOrResponseGenerator && !!(this.childNodeIdsOrResponseGenerator as ResponseGenerator).versionSnapshot) {
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
      this.predicateKindVersionSnapshot = event.predicateKindVersionSnapshot;
      this.parameterValues = event.parameterValues;
    },
    [ResponseGeneratorSet.KIND]: event => {
      this.childNodeIdsOrResponseGenerator = {
        versionSnapshot: event.responseGeneratorKindVersionSnapshot,
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
      predicateKindVersionSnapshot: this.predicateKindVersionSnapshot,
      parameters: this.parameterValues,
      childPredicateIdsOrResponseGeneratorId: this.childNodeIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, DomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, DomainEvents>(JOURNAL_NAME);
}
