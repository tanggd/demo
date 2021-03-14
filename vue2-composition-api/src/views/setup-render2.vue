<script lang="tsx">
import { defineComponent, ref, h } from "@vue/composition-api";
export default defineComponent({
  setup() {
    const total = ref(0);
    const add = () => {
      total.value++;
    };
    // 在setup中使用h
    return () =>
      h("div", [
        `total: ${total.value}`,
        h(
          "button",
          {
            on: {
              click: add
            }
          },
          "btn +1"
        )
      ]);
  }
});
</script>
