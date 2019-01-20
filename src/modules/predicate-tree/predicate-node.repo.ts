import { eventDrivenRepository } from '../../api-infrastructure';
import { PredicateNodeAggregate, PredicateNodeDomainEvents } from './predicate-node.types';

export const predicateNodeRepo = eventDrivenRepository<PredicateNodeAggregate, PredicateNodeDomainEvents>('predicate-node', {
  ChildPredicateNodeAdded: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: [...aggregate.childNodeIdsOrResponseGenerator as string[], evt.childNodeId],
    };
  },

  ResponseGeneratorSet: (aggregate, evt) => {
    return {
      ...aggregate,
      childNodeIdsOrResponseGenerator: {
        name: evt.responseGenerator.name,
        description: evt.responseGenerator.description,
        templateInfoOrGeneratorFunctionBody: evt.responseGenerator.templateInfoOrGeneratorFunctionBody,
      },
    };
  },
});
