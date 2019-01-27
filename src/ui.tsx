import { Component, Vue } from 'vue-property-decorator';
import { CONFIG } from './config';
import predicateTemplates from './modules/development/predicate-template/predicate-template.store';
import predicateNodes from './modules/development/predicate-tree/predicate-node.store';
import { Navbar } from './ui-infrastructure/navbar';
import './ui.scss';

@Component({})
export class App extends Vue {
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
