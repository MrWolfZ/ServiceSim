import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { OpenPredicateTemplateDialogAction } from '../predicate-template-dialog';
import { DeletePredicateTemplateAction } from './predicate-template-tile.actions';
import { PredicateTemplateTileState } from './predicate-template-tile.state';

@Component({
  selector: 'sim-predicate-template-tile',
  templateUrl: './predicate-template-tile.component.html',
  styleUrls: ['./predicate-template-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredicateTemplateTileComponent {
  @Input() state: PredicateTemplateTileState;

  constructor(private actionsSubject: ActionsSubject) { }

  delete() {
    this.actionsSubject.next(new DeletePredicateTemplateAction(this.state.templateId));
  }

  startEdit() {
    this.actionsSubject.next(new OpenPredicateTemplateDialogAction(this.state, this.state.templateId));
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
