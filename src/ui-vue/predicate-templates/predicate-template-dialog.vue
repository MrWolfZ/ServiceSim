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
  private isNewItem = true;
  private form: PredicateTemplateForm | null = null;

  mounted() {
    this.form = this.$refs.form as PredicateTemplateForm;
  }

  openNewItemDialog() {
    this.isNewItem = true;
    this.dialogIsOpen = true;
    this.form!.initialize({
      name: '',
      description: '',
      evalFunctionBody: '',
      parameters: [],
    });
  }

  private submitDialog() {
    this.closeDialog();
  }

  private cancelDialog() {
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogIsOpen = false;
  }

  render() {
    return (
      <form novalidate onSubmit={(e: Event) => e.preventDefault()}>
        <div class={`modal ${this.dialogIsOpen ? `is-active` : ``}`}>
          <div class='modal-background' />
          <div class='modal-card'>
            <header class='modal-card-head'>
              <p class='modal-card-title'>
                {this.isNewItem ? `Create new predicate template` : `Edit predicate template`}
              </p>
            </header>

            <section class='modal-card-body'>
              <PredicateTemplateForm ref='form' />
            </section>

            <footer class='modal-card-foot justify-content flex-end'>
              <button class='button is-danger is-outlined'
                      type='button'
                      onClick={() => this.cancelDialog()}>
                Cancel
              </button>
              <button class='button is-success'
                      onClick={() => this.submitDialog()}
                      disabled={this.form && this.form.isInvalid}>
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
.button {
  transition-duration: 0ms;
}
</style>
