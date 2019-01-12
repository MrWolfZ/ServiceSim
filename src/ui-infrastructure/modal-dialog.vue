<script lang="tsx">
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Emit } from './decorators';
import { TsxComponent } from './tsx-component';

export interface ModalDialogProps {
  isOpen: boolean;
  onAfterFadeOut?: () => any;
}

@Component({})
export class ModalDialog extends TsxComponent<ModalDialogProps> implements ModalDialogProps {
  @Prop() isOpen: boolean;

  @Emit()
  onAfterFadeOut() { }

  private onAfterFadeoutTimer: any;

  @Watch('isOpen')
  onIsOpenChanged(isOpen: boolean) {
    if (this.onAfterFadeoutTimer) {
      clearTimeout(this.onAfterFadeoutTimer);
    }

    if (!isOpen) {
      this.onAfterFadeoutTimer = setTimeout(() => this.onAfterFadeOut(), 200);
    }
  }

  render() {
    return (
      <div class={`modal ${this.isOpen ? `is-active` : ``}`}>
        <div class='modal-background' />

        <div class='modal-card'>

          {this.$slots.header &&
            <header class='modal-card-head'>
              <p class='modal-card-title'>
                {this.$slots.header}
              </p>
            </header>
          }

          <section class='modal-card-body'>
            {this.$slots.default}
          </section>

          {this.$slots.footer &&
            <footer class='modal-card-foot'>
              {this.$slots.footer}
            </footer>
          }

        </div>

      </div>
    );
  }
}

export default ModalDialog;
</script>

<style lang="scss">
@import 'variables';

.modal {
  display: flex;
  opacity: 0;
  pointer-events: none;
  transition: all ease 200ms;

  &.is-active {
    opacity: 1;
    pointer-events: inherit;
  }
}

.modal-card-head,
.modal-card-foot,
.modal-card-body {
  background-color: $body-background-color;
}
</style>
