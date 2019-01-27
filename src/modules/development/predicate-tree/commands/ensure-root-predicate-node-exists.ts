import { predicateNodeRepo } from '../predicate-node.repo';
import { RootNodeName } from '../predicate-node.types';

export async function ensureRootPredicateNodeExists() {
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
