import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Route, Router, } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TrackRouteIsActiveDirective } from './track-route-is-active.directive';

@Component({
  template: `
    <div [trackRouteIsActive]="route"
         [exact]="exact"
         [relative]="relative"
         [routeActiveClass]="routeActiveClass"
         [routeInactiveClass]="routeInactiveClass"></div>
  `,
})
class TestComponent {
  route: string | string[] = '';
  exact = false;
  relative = false;
  routeActiveClass = 'active';
  routeInactiveClass = 'inactive';
}

@Component({ template: '' })
class DummyComponent { }

describe(TrackRouteIsActiveDirective.name, () => {
  const ROUTES: Route[] = [
    {
      path: 'a',
      component: TestComponent,
      children: [
        {
          path: 'b',
          component: DummyComponent,
          children: [
            {
              path: 'c',
              component: DummyComponent,
            },
          ],
        },
        {
          path: 'd',
          component: DummyComponent,
        },
      ],
    },
    {
      path: '',
      component: DummyComponent,
    },
  ];

  const PARENT1_ROUTE = ROUTES[0].children![0];
  const PARENT2_ROUTE = ROUTES[0].children![1];

  const ROOT_ROUTE_PATH = [`/${ROUTES[0].path!}`];
  const PARENT1_ROUTE_PATH = [...ROOT_ROUTE_PATH, PARENT1_ROUTE.path!];
  const PARENT2_ROUTE_PATH = [...ROOT_ROUTE_PATH, PARENT2_ROUTE.path!];
  const CHILD_ROUTE_PATH = [...PARENT1_ROUTE_PATH, PARENT1_ROUTE.children![0].path!];

  let router: Router;
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let element: HTMLDivElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
      ],
      declarations: [
        TrackRouteIsActiveDirective,
        TestComponent,
        DummyComponent,
      ],
    }).compileComponents();

    router = TestBed.get(Router);

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.componentInstance;
    element = (fixture.nativeElement as HTMLElement).querySelector('div') as HTMLDivElement;

    component.route = PARENT1_ROUTE_PATH.join('/');
    fixture.detectChanges();
  });

  it('should add the routeActiveClass when exact matching route is navigated to', (done: DoneFn) => {
    router.navigate(PARENT1_ROUTE_PATH).then(() => {
      expect(element.classList.contains(component.routeActiveClass)).toBe(true);
      expect(element.classList.contains(component.routeInactiveClass)).toBe(false);
      done();
    });
  });

  it('should add the routeActiveClass when matching child route is navigated to', (done: DoneFn) => {
    router.navigate(CHILD_ROUTE_PATH).then(() => {
      expect(element.classList.contains(component.routeActiveClass)).toBe(true);
      expect(element.classList.contains(component.routeInactiveClass)).toBe(false);
      done();
    });
  });

  it('should add the routeInactiveClass when child route is navigated to and exact is true', (done: DoneFn) => {
    component.exact = true;
    fixture.detectChanges();

    router.navigate(CHILD_ROUTE_PATH).then(() => {
      expect(element.classList.contains(component.routeActiveClass)).toBe(false);
      expect(element.classList.contains(component.routeInactiveClass)).toBe(true);
      done();
    });
  });

  describe('relative route checks', () => {
    beforeEach((done: DoneFn) => {
      router.navigate(ROOT_ROUTE_PATH).then(() => {
        const directive = fixture.debugElement
          .query(e => !!e.injector.get<TrackRouteIsActiveDirective>(TrackRouteIsActiveDirective))
          .injector
          .get<TrackRouteIsActiveDirective>(TrackRouteIsActiveDirective) as TrackRouteIsActiveDirective;

        // when the component gets created the root route is set as activated route, however
        // for relative route checks we must ensure the correct route is set, therefore we
        // manually override the activatedRoute inside the directive to point to the correct
        // route
        (directive as any).activatedRoute = (directive as any).activatedRoute.children[0];

        component.exact = true;
        component.relative = true;
        component.route = '';
        fixture.detectChanges();

        done();
      });
    });

    it('should add the routeActiveClass when exact matching route is navigated to, exact is true', () => {
      expect(element.classList.contains(component.routeActiveClass)).toBe(true);
      expect(element.classList.contains(component.routeInactiveClass)).toBe(false);
    });

    it('should add the routeInactiveClass when child route is navigated to, exact is true', (done: DoneFn) => {
      router.navigate(CHILD_ROUTE_PATH).then(() => {
        expect(element.classList.contains(component.routeActiveClass)).toBe(false);
        expect(element.classList.contains(component.routeInactiveClass)).toBe(true);
        done();
      });
    });
  });

  it('should add the routeInactiveClass when non-matching route is navigated to', (done: DoneFn) => {
    router.navigate(PARENT2_ROUTE_PATH).then(() => {
      expect(element.classList.contains(component.routeActiveClass)).toBe(false);
      expect(element.classList.contains(component.routeInactiveClass)).toBe(true);
      done();
    });
  });

  it('should react to changes in tracked route', (done: DoneFn) => {
    router.navigate(PARENT2_ROUTE_PATH)
      .then(() => {
        expect(element.classList.contains(component.routeActiveClass)).toBe(false);
        expect(element.classList.contains(component.routeInactiveClass)).toBe(true);
        component.route = PARENT2_ROUTE_PATH;
        fixture.detectChanges();
        expect(element.classList.contains(component.routeActiveClass)).toBe(true);
        expect(element.classList.contains(component.routeInactiveClass)).toBe(false);
        done();
      });
  });
});
