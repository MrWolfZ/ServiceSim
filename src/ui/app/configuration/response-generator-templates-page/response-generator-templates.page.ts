import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ResponseGeneratorTemplatesPageState, RootState } from './response-generator-templates.state';

@Component({
  templateUrl: './response-generator-templates.page.html',
  styleUrls: ['./response-generator-templates.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseGeneratorTemplatesPage {
  @HostBinding('class.page') page = true;

  state$: Observable<ResponseGeneratorTemplatesPageState>;

  constructor(store: Store<RootState>) {
    this.state$ = store.select(s => s.responseGeneratorTemplatesPage);
  }
}
