import { merge, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Command, createCommandFn } from 'src/application/infrastructure/cqrs';
import { createServiceInvocation } from 'src/application/service-invocation/commands/create-service-invocation';
import { setServiceInvocationResponse } from 'src/application/service-invocation/commands/set-service-invocation-response';
import { ServiceRequest, ServiceResponse } from 'src/domain/service-invocation';
import { logger } from 'src/infrastructure/logging';
import { createObservable } from 'src/util/observable';
import { getPredicateTree, PredicateNode, ResponseGeneratorFunction } from '../queries/get-predicate-tree';

export type ProcessSimulationRequestCommandType = 'process-simulation-request';

export interface ProcessSimulationRequestCommand extends Command<ProcessSimulationRequestCommandType, ProcessSimulationRequestCommandResponse> {
  request: ServiceRequest;
  timeoutInMillis: number;
}

export interface ProcessSimulationRequestCommandResponse {
  response: ServiceResponse;
}

export async function processSimulationRequestHandler(
  { request, timeoutInMillis }: ProcessSimulationRequestCommand,
): Promise<ProcessSimulationRequestCommandResponse> {
  const { invocationId, invocationVersion } = await createServiceInvocation({ request });

  return await merge(
    createObservable<ProcessSimulationRequestCommandResponse>(
      obs => {
        // tslint:disable-next-line:no-floating-promises
        processRequest();

        let canceled = false;

        return () => canceled = true;

        async function processRequest() {
          let response: ServiceResponse = {
            statusCode: 404,
            body: '',
            contentType: '',
          };

          const rootNode = await getPredicateTree({});

          if (rootNode) {
            const node = await findNode(rootNode.childNodesOrResponseGenerator as PredicateNode[]);
            if (node) {
              const generator = node.childNodesOrResponseGenerator as ResponseGeneratorFunction;
              response = await Promise.resolve(generator(request));
            }
          }

          if (canceled) {
            logger.warn(`received response from predicate tree after timeout for invocation ${invocationId}`);
            return;
          }

          await setServiceInvocationResponse({
            invocationId,
            unmodifiedInvocationVersion: invocationVersion,
            response,
          });

          obs.next({ response });
        }
      }
    ),
    timer(timeoutInMillis).pipe(map(() => { throw new Error(`the request timed out after ${timeoutInMillis}ms`); })),
  ).pipe(take(1)).toPromise();

  async function findNode(nodes: PredicateNode[]): Promise<PredicateNode | undefined> {
    for (const node of nodes) {
      if (!node.childNodesOrResponseGenerator || Array.isArray(node.childNodesOrResponseGenerator) && node.childNodesOrResponseGenerator.length === 0) {
        logger.debug(`simulation API: skipping node ${node.nodeId} since it has neither child nodes nor a response generator`);
        continue;
      }

      try {
        const nodeEvalutedToTrue = await node.evaluate(request);
        logger.debug(`simulation API: node ${node.nodeId} evaluated to ${nodeEvalutedToTrue}`);
        if (!nodeEvalutedToTrue) {
          continue;
        }
      } catch (e) {
        logger.error(e);
        continue;
      }

      if (!Array.isArray(node.childNodesOrResponseGenerator)) {
        logger.debug(`simulation API: using response generator of node ${node.nodeId}`);
        return node;
      }

      const childNode = await findNode(node.childNodesOrResponseGenerator);
      if (childNode) {
        return childNode;
      }
    }

    logger.debug(`simulation API: no matching node found`);
    return undefined;
  }
}

export const processSimulationRequest = createCommandFn<ProcessSimulationRequestCommand>('process-simulation-request');
