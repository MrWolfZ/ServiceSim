import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RootState } from 'app/app.state';
import { NavbarState } from 'app/infrastructure';

@Component({
  selector: 'sim-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navbar$: Observable<NavbarState>;

  constructor(store: Store<RootState>) {
    this.navbar$ = store.pipe(select(s => s.infrastructure.navbar));
  }
}
