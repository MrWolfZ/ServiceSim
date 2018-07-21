import { ChangeDetectorRef, Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[trackRouteIsActive]',
  exportAs: 'trackRouteIsActive',
})
export class TrackRouteIsActiveDirective implements OnInit, OnDestroy, OnChanges {
  private isInitialized = false;
  private subscription: Subscription;

  isActive: boolean | undefined = undefined;

  // tslint:disable-next-line:no-input-rename
  @Input('trackRouteIsActive') route: string | string[];
  @Input() routeInactiveClass = 'route-inactive';
  @Input() routeActiveClass = 'route-active';
  @Input() exact = false;
  @Input() relative = false;

  constructor(
    private router: Router,
    private element: ElementRef,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {
    this.subscription = router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        this.update();
      }
    });
  }

  ngOnInit() {
    this.isInitialized = true;
    this.update();
  }

  ngOnChanges() {
    this.update();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private update() {
    if (!this.router.navigated || !this.isInitialized) {
      return;
    }

    const route = !this.route && this.relative ? ['.'] : Array.isArray(this.route) ? this.route : [this.route];
    const extras: NavigationExtras = {
      ...this.relative ? { relativeTo: this.activatedRoute } : {},
      queryParams: this.router.routerState.snapshot.root.queryParams,
    };

    const urlTree = this.router.createUrlTree(route, extras);

    const isActive = !!urlTree && this.router.isActive(urlTree, this.exact);
    if (this.isActive !== isActive) {
      this.isActive = isActive;
      if (isActive) {
        this.renderer.addClass(this.element.nativeElement, this.routeActiveClass);
        this.renderer.removeClass(this.element.nativeElement, this.routeInactiveClass);
      } else {
        this.renderer.addClass(this.element.nativeElement, this.routeInactiveClass);
        this.renderer.removeClass(this.element.nativeElement, this.routeActiveClass);
      }

      // we need to mark our containing component for a check since we are exporting ourselves
      // as a variable which means some other component might need to react to our internal
      // state change
      this.cdRef.markForCheck();
    }
  }
}
