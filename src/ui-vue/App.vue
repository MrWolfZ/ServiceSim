<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import Layout from './infrastructure/layout.vue';

@Component({
  components: {
    Layout,
  },
})
export default class App extends Vue {
  render() {
    return <Layout></Layout>;
  }
}
</script>

<style lang="scss">
@import "~bulmaswatch/darkly/variables";
@import "styles/_constants";
@import "~bulma/bulma";
@import "styles/_darkly-overrides";
@import '~bulma-checkradio/dist/css/bulma-checkradio';
@import '~bulma-tooltip/dist/css/bulma-tooltip';

html, body {
  height: 100%;
  overflow: auto;
}

.page {
  height: 100%;
  display: block;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal {
  display: flex;
  opacity: 0;
  pointer-events: none;
  transition: all ease 200ms;

  &.is-active {
    opacity: 1;
    pointer-events: inherit;
  }

  .input,
  .textarea,
  .select>select {
    background-color: $body-background-color;
  }
}

.input,
.textarea {
  border: 0;
}

.textarea.code {
  font-family: "Inconsolata", "Consolas", "Monaco", monospace;
}

.field.title .input {
  font-size: 120%;
  font-weight: bold;
}

// override normal sized radio control size
// to ensure the dot is properly centered
.is-checkradio[type="radio"] {
  +label::before,
  +label:before,
  +label::after,
  +label:after {
    width: 24px;
    height: 24px;
  }
}

.form-control-errors .error {
  color: $danger;
  font-size: 0.75rem;
}

.is-paddingless-vertical {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.is-borderless {
  border: 0 !important;
}

.justify-content {
  &.flex-end {
    justify-content: flex-end;
  }
}
</style>
