<template>
  <div class="content">
    <div>ref total: {{ total }}</div>
    <div>reactive obj: {{ obj }}</div>
    <div>computed total2: {{ total2 }}</div>
    <div>readonly readonlyType: {{ readonlyType }}</div>
    <button @click="add">add === total+1</button>
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  readonly
} from "@vue/composition-api";
export default defineComponent({
  props: {
    msg: String
  },
  setup() {
    const total = ref(0);
    const obj = reactive({
      page: 1,
      size: 10
    });
    const total2 = computed(() => {
      return total.value * 2;
    });
    const readonlyType = readonly("readonly");
    console.log(readonlyType);
    const add = () => {
      total.value++;
      obj.page++;
      readonlyType = 'readonly-2' // 报错，只读

    };
    //
    // 暴露给template使用
    return {
      total,
      total2,
      obj,
      readonlyType,
      add
    };
  }
});
</script>
