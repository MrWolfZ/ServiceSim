import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PredicateKindListState } from './predicate-kind-list.state';

@Component({
  selector: 'sim-predicate-kind-list',
  templateUrl: './predicate-kind-list.component.html',
  styleUrls: ['./predicate-kind-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindListComponent {
  @Input() state: PredicateKindListState;
}
