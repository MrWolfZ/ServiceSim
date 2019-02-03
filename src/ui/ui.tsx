import { Event } from 'src/domain/infrastructure/ddd';
import { publish, registerUniversalEventHandler } from 'src/infrastructure/bus';
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

    registerUniversalEventHandler(() => this.loadAllDataAsync());
    registerUniversalEventHandler(evt => {
      logger.info(JSON.stringify(evt));
    });

    const eventSource = new EventSource(`${CONFIG.uiApiBaseUrl}/events`);

    eventSource.onmessage = async msg => {
      const event = JSON.parse(msg.data) as Event<any>;
      await publish(event);
    };

    eventSource.onerror = () => {
      logger.error('an error occured in the events connection');
    };

    // TODO: build smarter subscription mechanism to only subscribe to relevant events
    eventSource.addEventListener('event', async msg => {
      const event = JSON.parse((msg as MessageEvent).data) as Event<any>;
      await publish(event);
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
          <div class='page'>Loading...</div>
        }
      </div>
    );
  }
}
