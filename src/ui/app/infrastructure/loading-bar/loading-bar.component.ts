import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { concat, interval, of, Subscription } from 'rxjs';
import { delay, filter, first, map, pairwise, publish, scan, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { RootState } from '../infrastructure.state';

// Note that this component is an exception to the rule that non-page components
// must be dumb since it implements the loading bar outside of the angular realm
// for performance reasons
@Component({
  selector: 'sim-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent implements OnDestroy {
  @ViewChild('loadingBar') loadingBarElement: ElementRef;
  storeSubscription: Subscription;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    store: Store<RootState>,
  ) {
    this.storeSubscription =
      store
        .pipe(
          select(s => s.infrastructure.loadingBar.activationSemaphore),
          publish(obs =>
            obs.pipe(
              pairwise(),
              // only start the loading bar when the first request to make
              // it visible happens
              filter(([oldVal, newVal]) => oldVal === 0 && newVal === 1),
              switchMap(() =>
                concat(
                  concat(
                    interval(400).pipe(
                      // finish the loading animation once all requests are finished
                      takeUntil(obs.pipe(first(i => i === 0))),
                      startWith(0),
                      scan(progress => {
                        // after each interval we increase the loading bar width by
                        // 5-20% of the remaining width. This causes the navbar to slow
                        // down gradually. We limit the width to 95% to indicate that
                        // something is still loading
                        const progressLeft = 100 - progress;
                        const growthRate = 15;
                        const percentageGrowth = Math.round(Math.random() * growthRate) + 5;
                        const absoluteGrowth = Math.round(progressLeft * percentageGrowth / 100);
                        return Math.min(progress + absoluteGrowth, 95);
                      }, 0)
                    ),
                    // once the loading bar should finish we set the width to 100%
                    [100],
                  ).pipe(
                    map(progress => ({ type: 'prop', name: 'width', val: `${progress}%` as any })),
                    startWith(
                      { type: 'class', name: 'fade-out-1', val: false },
                      { type: 'class', name: 'fade-out-2', val: false },
                      { type: 'prop', name: 'opacity', val: '1' }
                    )
                  ),
                  // this observable causes the loading bar to fade out 250ms after it was
                  // set to full width. It also sets a class that animates opacity (we don't
                  // want opacity to be animated all the time since initially the loading
                  // bar should appear immediately). Since the width animation takes 500ms
                  // the fade-out will slightly overlap the width animation (which looks nice).
                  of(({ type: 'prop', name: 'opacity', val: '0' as any })).pipe(
                    delay(250),
                    startWith(({ type: 'class', name: 'fade-out-1', val: true })),
                  ),
                  // after another 250ms (i.e. once the opacity animation finished) we set the
                  // width to 0% immediately. For that we also disabled the width animation
                  // so that further loading bar requests don't show the width sliding back.
                  of(
                    { type: 'class', name: 'fade-out-1', val: false },
                    { type: 'class', name: 'fade-out-2', val: true },
                    { type: 'prop', name: 'width', val: '0%' as any }
                  ).pipe(delay(250))
                ),
              ),
            ),
          ),
      )
        .subscribe(o => o.type === 'prop' ? this.setLoadingBarStyle(o.name, o.val) : this.setLoadingBarClass(o.name, o.val));
  }

  // The .runOutsideAngular() calls are used to prevent change
  // detection to be triggered when the navbar updates. It is
  // a small performance enhancement since there is no need for
  // any component to update based on the navbar
  private setLoadingBarClass(className: string, isAdd: boolean) {
    this.ngZone.runOutsideAngular(() => {
      if (isAdd) {
        this.renderer.addClass(
          this.loadingBarElement.nativeElement,
          className,
        );
      } else {
        this.renderer.removeClass(
          this.loadingBarElement.nativeElement,
          className,
        );
      }
    });
  }

  private setLoadingBarStyle(propertyName: string, value: string): void {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setStyle(
        this.loadingBarElement.nativeElement,
        propertyName,
        value
      );
    });
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
