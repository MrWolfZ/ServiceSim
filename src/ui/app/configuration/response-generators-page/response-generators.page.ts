import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ResponseGeneratorsPageState, RootState } from './response-generators.state';

@Component({
  templateUrl: './response-generators.page.html',
  styleUrls: ['./response-generators.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseGeneratorsPage {
  @HostBinding('class.page') page = true;

  state$: Observable<ResponseGeneratorsPageState>;

  constructor(store: Store<RootState>) {
    this.state$ = store.select(s => s.responseGenerators);
  }
}
