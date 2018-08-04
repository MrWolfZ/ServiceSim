import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { OpenPredicateTemplateDialogAction } from '../predicate-kind-dialog';
import { DeletePredicateKindAction } from './predicate-kind-tile.actions';
import { PredicateKindTileState } from './predicate-kind-tile.state';

@Component({
  selector: 'sim-predicate-kind-tile',
  templateUrl: './predicate-kind-tile.component.html',
  styleUrls: ['./predicate-kind-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateKindTileComponent {
  @Input() state: PredicateKindTileState;

  constructor(private actionsSubject: ActionsSubject) { }

  delete() {
    this.actionsSubject.next(new DeletePredicateKindAction(this.state.predicateKindId));
  }

  startEdit() {
    this.actionsSubject.next(new OpenPredicateTemplateDialogAction(this.state, this.state.predicateKindId));
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
