<template>
  <div class="content">
    <div>ref total: {{ total }}</div>
    <div>reactive obj: {{ obj }}</div>
    <div>computed total2: {{ total2 }}</div>
    <div>readonly readonlyType: {{ readonlyType }}</div>
    <button @click="add">add === total+1</button>
  </div>
</template>

<script lang="ts">
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
    // total.value = '333' // 在 lang为ts的情况下提示错误,类型推导

    interface ObjInterface {
      page: number,
      size: number
    }
    const obj = reactive<ObjInterface>({
      page: 1,
      size: 10,
      // total: total
      // total: total.value
    });

    const total2 = computed(() => {
      return total.value * 2;
    });
    const readonlyType = readonly("readonly");
    console.log(readonlyType);
    const add = () => {
      total.value++;
      obj.page++;

      // obj.total += 2;
      // readonlyType = 'readonly-2' // 报错，只读
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
