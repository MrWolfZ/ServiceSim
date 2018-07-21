import { LocationStrategy } from '@angular/common';
import { ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { RootState } from '../../app.state';
import { RouterState } from '../../platform';

import { Route } from './routing.state';
import { createExternalUrl } from './routing.util';

// tslint:disable:no-input-rename

export abstract class AbstractLinkDirective implements OnChanges, OnDestroy {
  private subscriptions: Subscription[] = [];

  @HostBinding('attr.target') @Input() target: string | undefined;
  @Input() isDisabled?: boolean;

  constructor(
    private store: Store<RootState>,
    private router: Router,
    private locationStrategy: LocationStrategy,
    private elementRef: ElementRef,
  ) {
    this.subscriptions.push(
      store.select(s => s.router.navigationId).subscribe(() => this.updateTargetUrlAndHref())
    );
  }

  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
  onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
    if (this.isDisabled) {
      return false;
    }

    if (button !== 0 || ctrlKey || metaKey || shiftKey) {
      return true;
    }

    if (typeof this.target === 'string' && this.target !== '_self') {
      return true;
    }

    this.store.dispatch(this.createNavigateAction());
    return false;
  }

  private updateTargetUrlAndHref() {
    if (this.isDisabled) {
      this.elementRef.nativeElement.href = '';
      return;
    }

    this.store.pipe(
      take(1),
      map(s => s.router),
    ).subscribe(routerState => {
      const href = createExternalUrl(this.createRoute(routerState), this.router, this.locationStrategy);
      this.elementRef.nativeElement.href = href;
    });
  }

  abstract createNavigateAction(): Action;
  abstract createRoute(routerState: RouterState): Route;

  ngOnChanges() {
    this.updateTargetUrlAndHref();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
