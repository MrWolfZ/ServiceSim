<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import TsxComponent from '../tsx-component';

interface PredicateTemplateDialogProps {
  dialogIsOpen: boolean;
}

@Component({
  components: {},
})
export default class PredicateTemplateDialog extends TsxComponent<PredicateTemplateDialogProps> implements PredicateTemplateDialogProps {
  @Prop() dialogIsOpen = false;
  dialogIsClosing = false;
  isNewItem = true;
  isSaving = false;
  formState: any = {};

  submitDialog() {
    // g
  }

  cancelDialog() {
    // g
  }

  render() {
    if (!this.dialogIsOpen) {
      return null;
    }

    return (
      <form ngrxFormState='state.formState'>
        <div class={`modal${this.dialogIsOpen && !this.dialogIsClosing ? ` is-active` : ``}`}>
          <div class='modal-background'></div>
          <div class='modal-card'>

            <header class='modal-card-head'>
              <p class='modal-card-title'>
                { this.isNewItem ? `Create new predicate template` : `Edit predicate template` }
              </p>
            </header>

            {
              /*
                We remove the body from the DOM while the dialog is not open to
                prevent any animations from playing when the dialog is opened.
              */
            }

            { this.dialogIsOpen &&
              <section class='modal-card-body'>
                <sim-predicate-template-form formState='state.formState'></sim-predicate-template-form>
              </section>
            }

            <footer class='modal-card-foot justify-content flex-end'>
              <button class='button is-danger is-outlined'
                      type='button'
                      onClick={() => this.cancelDialog()}
                      disabled={this.isSaving}>
                Cancel
              </button>
              <button class={`button is-success${this.isSaving ? `is-loading` : ``}`}
                      onClick={() => this.submitDialog()}
                      disabled={this.formState.isInvalid && this.formState.isSubmitted}>
                Save
              </button>
            </footer>
          </div>
        </div>
      </form>
    );
  }
}
</script>

<style scoped lang="scss">
</style>
