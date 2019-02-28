import { stateful } from '../infrastructure/stateful-component';
import { Container } from './common-components/layout/container';
import { ADMIN_ROUTE, CONDITION_TEMPLATES_ROUTE, ENGINE_RUNTIME_ROUTE, RESPONDER_TEMPLATES_ROUTE, SERVICES_CONFIGURATION_ROUTE } from './routing';

export const Navbar = stateful<{ menuIsOpen: boolean }>(
  { menuIsOpen: false },
  {},
  function Navbar({ menuIsOpen, patchState }) {
    return (
      <nav
        class='navbar is-fixed-top'
        role='navigation'
        aria-label='main navigation'
      >
        <Container>
          <NavbarBrand />

          <div class={`navbar-menu ${menuIsOpen ? `is-active` : ``}`}>
            <div class='navbar-start'>

              <NavLink to={ENGINE_RUNTIME_ROUTE}>
                Engine Runtime
              </NavLink>

              <MultiNavLink label='Engine Configuration'>

                <NavLink to={SERVICES_CONFIGURATION_ROUTE}>
                  Services
                </NavLink>

                <NavLink to={CONDITION_TEMPLATES_ROUTE}>
                  Condition Templates
                </NavLink>

                <NavLink to={RESPONDER_TEMPLATES_ROUTE}>
                  Responder Templates
                </NavLink>

              </MultiNavLink>

              <NavLink to={ADMIN_ROUTE}>
                Admin
              </NavLink>

              <MultiNavLink label='Legacy'>

                <NavLink to='predicate-tree'>
                  Predicate Tree
                </NavLink>

                <NavLink to='predicate-templates'>
                  Predicate Templates
                </NavLink>

                <NavLink to='response-generator-templates'>
                  Response Generator Templates
                </NavLink>

              </MultiNavLink>

            </div>

          </div>
        </Container>
      </nav>
    );

    function NavbarBrand() {
      return (
        <div class='navbar-brand' style={{ marginLeft: 0 }}>
          <a
            role='button'
            class={`navbar-burger has-text-white ${menuIsOpen ? `is-active` : ``}`}
            onClick={() => patchState(s => ({ menuIsOpen: !s.menuIsOpen }))}
          >
            <span />
            <span />
            <span />
          </a>
        </div>
      );
    }

    interface NavLinkProps extends ComponentProps {
      to: string;
    }

    function NavLink({ to, children }: NavLinkProps) {
      return (
        <router-link
          to={{ name: to }}
          class='navbar-item has-text-white'
          onClick={() => patchState(() => ({ menuIsOpen: false }))}
        >
          {children}
        </router-link>
      );
    }

    interface MultiNavLinkProps extends ComponentProps {
      label: string;
    }

    function MultiNavLink({ label, children }: MultiNavLinkProps) {
      return (
        <div class='navbar-item has-dropdown is-hoverable'>
          <a class='navbar-link'>
            {label}
          </a>

          <div class='navbar-dropdown'>
            {children}
          </div>
        </div>
      );
    }
  }
);
