<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Navbar extends Vue {
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

              <router-link
                to='predicate-tree'
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Predicate Tree
              </router-link>

              <router-link
                to='predicate-templates'
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Predicate Templates
              </router-link>

              <router-link
                to='response-generator-templates'
                class='navbar-item has-text-white'
                onClick={() => this.closeMenu()}
              >
                Response Generator Templates
              </router-link>

            </div>

          </div>
        </div>
      </nav>
    );
  }
}
</script>

<style scoped lang='scss'>
</style>
