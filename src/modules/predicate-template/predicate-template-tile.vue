<script lang="tsx">
import { Component, Emit, Prop } from 'vue-property-decorator';
import { TsxComponent } from '../../ui-infrastructure';
import predicateTemplates from './predicate-template.store';

export interface PredicateTemplateTileProps {
  templateId: string;
  onEdit: () => any;
  onDelete: () => any;
}

@Component({
  components: {},
})
export default class PredicateTemplateTile extends TsxComponent<PredicateTemplateTileProps> implements PredicateTemplateTileProps {
  @Prop() templateId!: string;

  get template() {
    return predicateTemplates.state.templatesById[this.templateId];
  }

  @Emit()
  onEdit() { }

  @Emit()
  onDelete() { }

  render() {
    return (
      <div class='box root'>
        <div class='level is-marginless is-mobile'>
          <div class='level-left'>
            <h2 class='name'>
              {this.template.name}
            </h2>
          </div>
          <div class='level-right'>
            <div class='buttons is-marginless'>
              <div>
                <button
                  class='button is-danger'
                  type='button'
                  onClick={() => this.onDelete()}
                >
                  <span>Delete</span>
                  <span class='icon is-small'>
                    <fa-icon icon='times' />
                  </span>
                </button>
                <button
                  class='button is-primary'
                  type='button'
                  onClick={() => this.onEdit()}
                >
                  <span>Edit</span>
                  <span class='icon is-small'>
                    <fa-icon icon='edit' />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <p class='description'>
          {this.template.description}
        </p>

        <label class='label'>
          Function Body
        </label>
        <pre>{this.template.evalFunctionBody}</pre>

        <div class='parameters'>
          <div class='parameters-title'>
            <label class='label'>Parameters</label>
            {this.template.parameters.length === 0 &&
              <p>
                This predicate template does not have any parameters.
              </p>
            }
          </div>

          {
            this.template.parameters.map(parameter =>
              <div key={parameter.name} class='box parameter'>

                <h3 class='parameter-name'>
                  {parameter.name}
                </h3>

                <p class='parameter-description'>
                  {parameter.description}
                </p>

                <div class='columns'>

                  <div class='column is-narrow'>
                    <label class='label'>Is Required?</label>
                    <span>{parameter.isRequired ? 'Yes' : 'No'}</span>
                  </div>

                  <div class='column is-narrow'>
                    <label class='label'>Value Type</label>
                    <span>{parameter.valueType}</span>
                  </div>

                  <div class='column'>
                    <label class='label'>Default Value</label>
                    <span>{parameter.defaultValue}</span>
                  </div>

                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
@import 'variables';
@import '~bulma/sass/utilities/mixins';

.root {
  height: 100%;
}

@include from($desktop) {
  .buttons {
    opacity: 0;
    transition: opacity ease 200ms;
  }

  .root:hover .buttons {
    opacity: 1;
  }
}

.name {
  font-size: 120%;
  font-weight: bold;
}

.description {
  margin-bottom: 1rem;
}

.parameters {
  padding-top: 1rem;
}

.parameters-title {
  margin-bottom: 0.5rem;
}

.parameter.box {
  border: 1px solid $background;
}

.parameter {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.parameter-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.parameter-description {
  margin-bottom: 0.5rem;
}
</style>
