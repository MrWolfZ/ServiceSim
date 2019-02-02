import { Component, Vue } from 'vue-property-decorator';

@Component({})
export class Navbar extends Vue {
  menuIsOpen = false;

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  closeMenu() {
    this.menuIsOpen = false;
  }

  render() {
    return (
      <nav
        class='navbar is-fixed-top'
        role='navigation'
        aria-label='main navigation'
      >
        <div class='container is-fluid'>

          <div class='navbar-brand'>
            <a
              role='button'
              class={`navbar-burger has-text-white ${this.menuIsOpen ? `is-active` : ``}`}
              onClick={() => this.toggleMenu()}
            >
              <span />
              <span />
              <span />
            </a>
          </div>

          <div class={`navbar-menu ${this.menuIsOpen ? `is-active` : ``}`}>
            <div class='navbar-start'>

              <div class='navbar-item has-dropdown is-hoverable'>
                <a class='navbar-link'>
                  Development
                </a>

                <div class='navbar-dropdown'>
                  <a class='navbar-item'>
                    About
                  </a>
                  <a class='navbar-item'>
                    Jobs
                  </a>
                  <a class='navbar-item'>
                    Contact
                  </a>
                  <hr class='navbar-divider' />
                  <a class='navbar-item'>
                    Report an issue
                  </a>
                </div>
              </div>

              <router-link
                to={{ name: 'predicate-tree' }}
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Predicate Tree
              </router-link>

              <router-link
                to={{ name: 'predicate-templates' }}
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Predicate Templates
              </router-link>

              <router-link
                to={{ name: 'response-generator-templates' }}
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Response Generator Templates
              </router-link>

              <router-link
                to={{ name: 'admin' }}
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Admin
              </router-link>

            </div>

          </div>
        </div>
      </nav>
    );
  }
}
