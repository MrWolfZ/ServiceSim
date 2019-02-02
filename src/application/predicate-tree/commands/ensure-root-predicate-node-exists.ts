import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { RootNodeName } from 'src/domain/predicate-tree';
import { predicateNodeRepo } from '../predicate-node.repo';

export type EnsureRootPredicateNodeExistsCommandType = 'ensure-root-predicate-node-exists';

export interface EnsureRootPredicateNodeExistsCommand extends Command<EnsureRootPredicateNodeExistsCommandType, { nodeId: string }> { }

export async function ensureRootPredicateNodeExistsHandler(_: EnsureRootPredicateNodeExistsCommand) {
  const rootNodeName: RootNodeName = 'ROOT';

  const rootNodes = (await predicateNodeRepo.query.byProperties({ name: rootNodeName }));

  if (rootNodes.length > 0) {
    return {
      nodeId: rootNodes[0].id,
    };
  }

  const rootNode = await predicateNodeRepo.create({
    name: rootNodeName,
    description: 'Root node of the predicate tree. This node should never be exposed to the user directly.',
    templateInfoOrEvalFunctionBody: 'return true;',
    childNodeIdsOrResponseGenerator: [],
  });

  return {
    nodeId: rootNode.id,
  };
}

export const ensureRootPredicateNodeExists = createCommandFn<EnsureRootPredicateNodeExistsCommand>('ensure-root-predicate-node-exists');
