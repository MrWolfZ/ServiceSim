import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { RootState } from 'app/app.state';
import { NavbarState, SetPageTitleAction } from 'app/infrastructure';

@Component({
  selector: 'sim-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  navbar$: Observable<NavbarState>;

  constructor(private store: Store<RootState>) {
    this.navbar$ = store.pipe(select(s => s.infrastructure.navbar));
  }

  ngOnInit() {
    this.store.dispatch(new SetPageTitleAction());
  }
}
