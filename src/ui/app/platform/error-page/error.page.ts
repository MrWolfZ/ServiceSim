import { ChangeDetectionStrategy, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ClearApiErrorAction, SetApiErrorAction } from './error.actions';
import { ApiError } from './error.state';

import { SetPageTitleAction } from '../platform.actions';
import { RootState } from '../platform.state';

export const ERROR_PAGE_NAME = 'Error';

@Component({
  selector: 'sim-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage implements OnInit, OnDestroy {
  @HostBinding('class.page') page = true;

  apiError$: Observable<ApiError | undefined>;
  timeOfError$: Observable<Date>;

  constructor(private store: Store<RootState>, private route: ActivatedRoute) {
    this.apiError$ = store.pipe(select(s => s.platform.errorPage.apiError));
    this.timeOfError$ = this.apiError$.pipe(filter(e => !!e), map(e => new Date(e!.timeOfErrorEpoch)));
  }

  ngOnInit() {
    this.store.dispatch(new SetPageTitleAction(ERROR_PAGE_NAME));

    const apiError = JSON.parse(this.route.snapshot.queryParams.apiError) as ApiError;
    this.store.dispatch(new SetApiErrorAction(apiError));
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearApiErrorAction());
  }

  trackByIdentity<T>(_: number, item: T) {
    return item;
  }
}
