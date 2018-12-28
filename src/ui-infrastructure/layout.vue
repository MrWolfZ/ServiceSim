<script lang="tsx">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from './navbar.vue';

@Component({
  components: {
    Navbar,
  },
})
export default class Layout extends Vue {
  render() {
    return (
      <div>
        <Navbar />
        <div class='main-content'>
          <router-view />
        </div>
      </div>
    );
  }
}
</script>

<style scoped lang="scss">
.main-content {
  margin-top: 4rem;
  height: calc(100% - 4rem);
}
</style>
