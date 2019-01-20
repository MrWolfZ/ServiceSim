import { predicateNodeRepo } from '../predicate-node.repo';

export async function dropAllPredicateNodes() {
  await predicateNodeRepo.dropAll();
}
