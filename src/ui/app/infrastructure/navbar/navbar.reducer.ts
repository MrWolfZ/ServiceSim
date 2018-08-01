import { CloseMenuAction, NavbarActions, ToggleMenuAction } from './navbar.actions';
import { INITIAL_NAVBAR_STATE, NavbarState } from './navbar.state';

export function navbarReducer(state = INITIAL_NAVBAR_STATE, action: NavbarActions): NavbarState {
  switch (action.type) {
    case ToggleMenuAction.TYPE:
      return {
        ...state,
        menuIsOpen: !state.menuIsOpen,
      };

    case CloseMenuAction.TYPE:
      if (!state.menuIsOpen) {
        return state;
      }

      return {
        ...state,
        menuIsOpen: false,
      };

    default:
      return state;
  }
}
