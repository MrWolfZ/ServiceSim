import { Component, Prop, Watch } from 'vue-property-decorator';
import { Emit } from './decorators';
import './modal-dialog.scss';
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
    const style = {
      display: 'flex',
      opacity: this.isOpen ? 1 : 0,
      pointerEvents: this.isOpen ? 'inherit' : 'none',
      transition: 'all ease 200ms',
    };

    return (
      <div class={`modal ${this.isOpen ? `is-open` : ``}`} style={style}>
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
