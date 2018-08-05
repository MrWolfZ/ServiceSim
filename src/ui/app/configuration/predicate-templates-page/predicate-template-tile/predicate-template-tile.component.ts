import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { OpenPredicateTemplateDialogAction } from '../predicate-template-dialog';
import { ParameterFormValue } from '../predicate-template-dialog/predicate-template-dialog.dto';
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
    this.actionsSubject.next(new OpenPredicateTemplateDialogAction({
      name: this.state.name,
      description: this.state.description,
      evalFunctionBody: this.state.evalFunctionBody,
      parameters: this.state.parameters.map<ParameterFormValue>(p => ({
        name: p.name,
        description: p.description,
        isRequired: p.isRequired,
        valueType: p.valueType as any,
        defaultValue: p.defaultValue as any,
      })),
    }, this.state.templateId));
  }

  trackByIndex(idx: number) {
    return idx;
  }
}
