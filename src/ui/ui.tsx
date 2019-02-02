import { logger } from 'src/infrastructure/logging';
import { Component, Vue } from 'vue-property-decorator';
import { CONFIG } from '../infrastructure/config';
import predicateTemplates from './modules/predicate-template/predicate-template.store';
import predicateNodes from './modules/predicate-tree/predicate-node.store';
import { Navbar } from './shared/navbar';
import './ui.scss';

@Component({})
export class App extends Vue {
  private dataWasLoaded = false;

  async created() {
    await this.loadAllDataAsync();
    this.dataWasLoaded = true;

    const eventSource = new EventSource(`${CONFIG.uiApiBaseUrl}/events`);

    eventSource.onmessage = evt => {
      logger.info(evt.data);
      return this.loadAllDataAsync();
    };

    eventSource.onerror = evt => {
      logger.info(evt.data);
    };

    eventSource.addEventListener('event', msg => {
      logger.info((msg as MessageEvent).data);
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
