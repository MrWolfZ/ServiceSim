<script lang="tsx">
import { Component, Prop } from 'vue-property-decorator';
import { Emit, TsxComponent } from '../../ui-infrastructure';
import predicateTemplates from './predicate-template.store';

export interface PredicateTemplateTileProps {
  templateId: string;
  onEdit: () => any;
  onDelete: () => any;
}

@Component({})
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
      <tr class='root'>
        <td>
          {this.template.name}
        </td>

        <td>
          {this.template.description}
        </td>

        <td>
          <div class='buttons is-marginless'>
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
        </td>

      </tr>
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
