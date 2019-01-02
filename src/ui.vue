<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import predicateTemplates from './modules/predicate-template/predicate-template.store';
import predicateNodes from './modules/predicate-tree/predicate-node.store';
import Navbar from './ui-infrastructure/navbar.vue';

@Component({
  components: {
    Navbar,
  },
})
export default class App extends Vue {
  private dataWasLoaded = false;

  async created() {
    await Promise.all([
      predicateNodes.loadAllAsync(),
      predicateTemplates.loadAllAsync(),
    ]);

    this.dataWasLoaded = true;
  }

  render() {
    return (
      <div class='main-content'>
        <Navbar />
        {this.dataWasLoaded ?
          <router-view /> :
          <div>Loading...</div>
        }
      </div>
    );
  }
}
</script>

<style lang="scss">
@import '~bulmaswatch/darkly/variables';
@import 'variables';
@import '~bulma/bulma';
@import 'darkly-overrides';
@import '~bulma-checkradio/dist/css/bulma-checkradio';
@import '~bulma-tooltip/dist/css/bulma-tooltip';

html,
body {
  height: 100%;
  overflow: auto;
}

.main-content {
  margin-top: 4rem;
  height: calc(100% - 4rem);
}

.page {
  height: 100%;
  display: block;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.is-paddingless-vertical {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.is-borderless {
  border: 0 !important;
}
</style>
