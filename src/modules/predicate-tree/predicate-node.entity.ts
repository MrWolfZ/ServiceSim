import uuid from 'uuid';
import { EventSourcedEntityRepository } from '../../api-infrastructure/event-sourced-entity-repository';
import { EventSourcedRootEntity, Snapshot } from '../../api-infrastructure/event-sourced-root-entity';
import { ChildPredicateNodeAdded, createEventHandlerMap, PredicateNodeCreated, PredicateNodeDomainEvents, ResponseGeneratorSet } from './predicate-node.events';
import { PredicateNodeData, PredicateNodeEntity, PredicateTemplateInfo, ResponseGeneratorData } from './predicate-node.types';

const JOURNAL_NAME = 'predicate/Journal';

export class PredicateNode extends EventSourcedRootEntity<PredicateNodeDomainEvents> implements PredicateNodeEntity {
  name: string;
  description: string;
  templateInfoOrEvalFunctionBody: PredicateTemplateInfo | string;
  childNodeIdsOrResponseGenerator: string[] | ResponseGeneratorData | undefined;

  // static create(
  //   name: string,
  //   description: string,
  //   templateInfoOrCustomProperties: {
  //     template: PredicateTemplate;
  //     parameterValues: { [prop: string]: string | number | boolean };
  //   } | PredicateCustomProperties,
  //   parentNodeId: string | undefined,
  // ) {
  //   return new PredicateNode().apply(PredicateNodeCreated.create({
  //     nodeId: `predicate/${uuid()}`,
  //     name,
  //     description,
  //     templateInfoOrCustomProperties:
  //       isPredicateCustomProperties(templateInfoOrCustomProperties)
  //         ? templateInfoOrCustomProperties
  //         : {
  //           templateSnapshot: {
  //             templateId: templateInfoOrCustomProperties.template.id,
  //             version: templateInfoOrCustomProperties.template.unmutatedVersion,
  //             name: templateInfoOrCustomProperties.template.name,
  //             description: templateInfoOrCustomProperties.template.description,
  //             evalFunctionBody: templateInfoOrCustomProperties.template.evalFunctionBody,
  //             parameters: templateInfoOrCustomProperties.template.parameters,
  //           },
  //           parameterValues: templateInfoOrCustomProperties.parameterValues,
  //         },
  //     parentNodeId,
  //   }));
  // }

  static create(data: PredicateNodeData, id?: string) {
    return new PredicateNode().apply(PredicateNodeCreated.create({
      nodeId: id || `predicateNode.${uuid()}`,
      data,
    }));
  }

  setResponseGenerator(responseGenerator: ResponseGeneratorData) {
    if (Array.isArray(this.childNodeIdsOrResponseGenerator) && this.childNodeIdsOrResponseGenerator.length > 0) {
      throw new Error(`Cannot set response generator for predicate node ${this.id} since it already has child nodes!`);
    }

    return this.apply(ResponseGeneratorSet.create({
      nodeId: this.id,
      responseGenerator,
      // responseGeneratorName,
      // responseGeneratorDescription,
      // templateInfoOrCustomProperties:
      //   isResponseGeneratorCustomProperties(templateInfoOrCustomProperties)
      //     ? templateInfoOrCustomProperties
      //     : {
      //       templateSnapshot: {
      //         templateId: templateInfoOrCustomProperties.template.id,
      //         version: templateInfoOrCustomProperties.template.unmutatedVersion,
      //         name: templateInfoOrCustomProperties.template.name,
      //         description: templateInfoOrCustomProperties.template.description,
      //         generatorFunctionBody: templateInfoOrCustomProperties.template.generatorFunctionBody,
      //         parameters: templateInfoOrCustomProperties.template.parameters,
      //       },
      //       parameterValues: templateInfoOrCustomProperties.parameterValues,
      //     },
    }));
  }

  addChildPredicate(childNodeId: string) {
    if (!!this.childNodeIdsOrResponseGenerator && !!(this.childNodeIdsOrResponseGenerator as ResponseGeneratorData).templateInfoOrGeneratorFunctionBody) {
      throw new Error(`Cannot add child predicate node for predicate node ${this.id} since it already has a response generator set!`);
    }

    return this.apply(ChildPredicateNodeAdded.create({
      parentNodeId: this.id,
      childNodeId,
    }));
  }

  EVENT_HANDLERS = createEventHandlerMap(this);

  getSnapshotValue(): Snapshot<PredicateNode, PredicateNodeDomainEvents> {
    return {
      name: this.name,
      description: this.description,
      templateInfoOrEvalFunctionBody: this.templateInfoOrEvalFunctionBody,
      childNodeIdsOrResponseGenerator: this.childNodeIdsOrResponseGenerator,
    };
  }

  static readonly fromEvents = EventSourcedRootEntity.fromEventsBase<PredicateNode, PredicateNodeDomainEvents>(PredicateNode);
  static readonly ofIdAsync = EventSourcedEntityRepository.entityOfIdAsync(JOURNAL_NAME, PredicateNode.fromEvents);
  static readonly saveAsync = EventSourcedEntityRepository.saveAsync<PredicateNode, PredicateNodeDomainEvents>(JOURNAL_NAME);
  static readonly saveSnapshotAsync = EventSourcedEntityRepository.saveSnapshotAsync<PredicateNode, PredicateNodeDomainEvents>(JOURNAL_NAME);
}
