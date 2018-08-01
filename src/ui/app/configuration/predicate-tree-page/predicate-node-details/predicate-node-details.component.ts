import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PredicateNodeDetailsState } from './predicate-node-details.state';

@Component({
  selector: 'sim-predicate-node-details',
  templateUrl: './predicate-node-details.component.html',
  styleUrls: ['./predicate-node-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateNodeDetailsComponent {
  @Input() state: PredicateNodeDetailsState;
}
