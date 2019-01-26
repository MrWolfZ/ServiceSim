<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import { CONFIG } from './config';
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
    await this.loadAllDataAsync();
    this.dataWasLoaded = true;

    const eventSource = new EventSource(`${CONFIG.uiApiBaseUrl}/events`);

    eventSource.onmessage = evt => {
      console.log(evt);
      return this.loadAllDataAsync();
    };

    eventSource.onerror = evt => {
      console.log(evt);
    };

    eventSource.addEventListener('event', msg => {
      console.log(msg);
      return this.loadAllDataAsync();
    });

    // eventSource.close();
  }

  private async loadAllDataAsync() {
    predicateNodes.reset();
    predicateTemplates.reset();

    await Promise.all([
      predicateNodes.loadAllAsync(),
      predicateTemplates.loadAllAsync(),
    ]);
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

// override normal sized radio control size
// to ensure the dot is properly centered
.is-checkradio[type='radio'] {
  + label::before,
  + label:before,
  + label::after,
  + label:after {
    width: 24px;
    height: 24px;
  }
}

.expansion-container {
  overflow: hidden;
  transition: opacity 200ms ease;

  &.is-collapsed {
    height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  &.is-expanded {
    opacity: 1;
  }
}
</style>
