import { ROOT_NODE_NAME } from 'src/domain/predicate-tree';
import { Command, createCommandFn } from 'src/infrastructure/cqrs';
import { predicateNodeRepo } from '../predicate-node.repo';

export type EnsureRootPredicateNodeExistsCommandType = 'ensure-root-predicate-node-exists';

export interface EnsureRootPredicateNodeExistsCommand extends Command<EnsureRootPredicateNodeExistsCommandType, { nodeId: string }> { }

export async function ensureRootPredicateNodeExistsHandler(_: EnsureRootPredicateNodeExistsCommand) {
  const rootNodes = (await predicateNodeRepo.query.byProperties({ name: ROOT_NODE_NAME }));

  if (rootNodes.length > 0) {
    return {
      nodeId: rootNodes[0].id,
    };
  }

  const rootNode = await predicateNodeRepo.create({
    name: ROOT_NODE_NAME,
    description: 'Root node of the predicate tree. All requests pass through this node unconditionally.',
    templateInfoOrEvalFunctionBody: 'return true;',
    childNodeIdsOrResponseGenerator: [],
  });

  return {
    nodeId: rootNode.id,
  };
}

export const ensureRootPredicateNodeExists = createCommandFn<EnsureRootPredicateNodeExistsCommand>('ensure-root-predicate-node-exists');
