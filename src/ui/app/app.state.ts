import { InfrastructureState, RouterState } from './infrastructure';

export interface RootState {
  infrastructure: InfrastructureState;
  router: RouterState;
}
