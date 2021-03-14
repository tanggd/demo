<script lang="tsx">
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  setup() {
    const total = ref(0);
    const add = () => {
      total.value++;
    };
    return {
      total,
      add
    };
  },
  // 使用render函数
  render() {
    return (
      <div class="content">
        total: {this.total}
        <button on-click={this.add}>btn +1</button>
      </div>
    );
  }
});
</script>
