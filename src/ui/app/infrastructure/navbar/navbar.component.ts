import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';

import { CloseMenuAction, ToggleMenuAction } from './navbar.actions';
import { NavbarState } from './navbar.state';

@Component({
  selector: 'sim-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() state: NavbarState;

  constructor(private actionsSubject: ActionsSubject) {}

  toggleMenu() {
    this.actionsSubject.next(new ToggleMenuAction());
  }

  closeMenu() {
    this.actionsSubject.next(new CloseMenuAction());
  }
}
