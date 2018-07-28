import { animate, query, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

const collapsedStyle = style({
  height: 0,
  paddingTop: 0,
  paddingBottom: 0,
  opacity: 0,
  marginTop: 0,
  marginBottom: 0,
});

const expandedStyle = style({
  height: '*',
  paddingTop: '*',
  paddingBottom: '*',
  opacity: 1,
  marginTop: '*',
  marginBottom: '*',
});

const timings = '200ms ease';

const expandCollapseAnimation = trigger('expandCollapse', [
  transition('collapsed => expanded', [
    query('.expansion-container', [
      collapsedStyle,
      animate(timings, expandedStyle),
    ], { limit: 1 }),
  ]),
  transition('expanded => collapsed', [
    query('.expansion-container', [
      expandedStyle,
      animate(timings, collapsedStyle),
    ], { limit: 1 }),
  ]),
]);

type AnimationState = 'expanded' | 'collapsed' | 'hidden';

let idCount = 0;

@Component({
  selector: 'sim-expansion-container',
  template: `
  <div class="expansion-container" *ngIf="!isCollapsed">
    <ng-content></ng-content>
  </div>
  `,
  styles: ['.expansion-container { overflow: hidden; background-color: transparent; }'],
  animations: [
    expandCollapseAnimation,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ExpansionContainerComponent implements OnDestroy {
  private isHidden = false;
  // tslint:disable-next-line:variable-name
  private _isCollapsed = false;
  private documentObserver: MutationObserver;

  @Input() set isCollapsed(value: boolean) {
    this._isCollapsed = value;
  }

  @Output() isHiddenChanged = new EventEmitter<boolean>();

  // tslint:disable-next-line:adjacent-overload-signatures
  get isCollapsed() {
    return this._isCollapsed;
  }

  @HostBinding('@expandCollapse')
  get animationState(): AnimationState {
    // setting the state to 'hidden' when the element is not present in the DOM
    // is a workaround for a bug in the Angular animations that causes nested
    // enter and leave animations inside projected content to not work properly;
    // basically when the component is expanded again, the state transition from
    // void => expanded is not played properly, which skips the animation (this is
    // because internally the state of the animation is in the special 'DELETED'
    // state, not 'void'). By introducing the additional state we force the
    // framework to transition from 'DELETED' to 'hidden' (which skips this
    // non-existing transition) and then transitions from 'hidden' to 'expanded'
    // which properly plays the transition
    return this.isHidden ? 'hidden' : this._isCollapsed ? 'collapsed' : 'expanded';
  }

  constructor(cdRef: ChangeDetectorRef, elementRef: ElementRef, renderer: Renderer2) {
    const id = `expansion-container-${idCount += 1}`;
    renderer.setAttribute(elementRef.nativeElement, 'id', id);

    this.documentObserver = new MutationObserver(() => {
      const isHidden = !document.getElementById(id);
      if (isHidden !== this.isHidden) {
        this.isHidden = isHidden;
        this.isHiddenChanged.emit(this.isHidden);
        cdRef.markForCheck();
      }
    });

    this.documentObserver.observe(document, {
      childList: true,
      subtree: true,
    });
  }

  ngOnDestroy() {
    this.documentObserver.disconnect();
  }
}
