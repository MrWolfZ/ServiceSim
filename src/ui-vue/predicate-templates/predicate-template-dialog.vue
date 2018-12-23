<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import PredicateTemplateForm from './predicate-template-form.vue';

@Component({
  components: {
    PredicateTemplateForm,
  },
})
export default class PredicateTemplateDialog extends Vue {
  private dialogIsOpen = false;
  private dialogIsClosing = false;
  private isNewItem = true;
  private isSaving = false;

  private form = () => this.$refs[this.form.name] as PredicateTemplateForm;

  openDialog(isNewItem = true) {
    this.isSaving = false;
    this.isNewItem = isNewItem;
    this.dialogIsOpen = true;
  }

  private async submitDialog() {
    this.isSaving = true;
    await new Promise<void>(resolve => setTimeout(resolve, 2000));
    this.closeDialog();
  }

  private cancelDialog() {
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogIsClosing = true;

    // to prevent jumping of modal while dialog is fading out
    setTimeout(() => {
      this.dialogIsOpen = false;
      this.dialogIsClosing = false;
    }, 200);
  }

  render() {
    return (
      <form novalidate onSubmit={(e: Event) => e.preventDefault()}>
        <div class={`modal ${this.dialogIsOpen && !this.dialogIsClosing ? `is-active` : ``}`}>
          <div class='modal-background' />
          <div class='modal-card'>
            <header class='modal-card-head'>
              <p class='modal-card-title'>
                {this.isNewItem ? `Create new predicate template` : `Edit predicate template`}
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
                <PredicateTemplateForm ref={this.form.name} />
              </section>
            }

            <footer class='modal-card-foot justify-content flex-end'>
              <button class='button is-danger is-outlined'
                      type='button'
                      onClick={() => this.cancelDialog()}
                      disabled={this.isSaving}>
                Cancel
              </button>
              <button class={`button is-success ${this.isSaving ? `is-loading` : ``}`}
                      onClick={() => this.submitDialog()}
                      disabled={this.form() && this.form().isInvalid && this.form().isSubmitted}>
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
