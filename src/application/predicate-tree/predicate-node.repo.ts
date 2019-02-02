import { PredicateNodeAggregate, PredicateNodeDomainEvents } from 'src/domain/predicate-tree';
import { eventDrivenRepository } from 'src/infrastructure/db';

export const predicateNodeRepo = eventDrivenRepository<PredicateNodeAggregate, PredicateNodeDomainEvents>('predicate-node', {
  ChildPredicateNodeAdded: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: [...aggregate.childNodeIdsOrResponseGenerator as string[], evt.childNodeId],
    };
  },

  ResponseGeneratorSetWithCustomBody: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: {
        name: evt.name,
        description: evt.description,
        templateInfoOrGeneratorFunctionBody: evt.generatorFunctionBody,
      },
    };
  },

  ResponseGeneratorSetFromTemplate: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: {
        name: evt.name,
        description: evt.description,
        templateInfoOrGeneratorFunctionBody: evt.templateInfo,
      },
    };
  },
});
