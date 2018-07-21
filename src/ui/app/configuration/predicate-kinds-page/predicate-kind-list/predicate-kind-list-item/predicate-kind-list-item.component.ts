import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PredicateKindListItemState } from './predicate-kind-list-item.state';

@Component({
  selector: 'sim-predicate-kind-list-item',
  templateUrl: './predicate-kind-list-item.component.html',
  styleUrls: ['./predicate-kind-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindListItemComponent {
  @Input() state: PredicateKindListItemState;

  isReadonly = true;
}
