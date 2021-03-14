<template>
  <div class="content">
    total: {{ total }}
    <button @click="add">btn +1</button>
  </div>
</template>
<script>
import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  props: {
    msg: String
  },
  setup(props, context) {
    console.log('setup')
    // console.log(props, context);
    const total = ref(0);
    const add = () => {
      total.value++;
    };
    // 暴露给template使用
    return {
      total,
      add
    };
  },
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created')
  },
  beforeMount() {
    console.log('beforeMount')
  },
  mounted() {
    console.log('mounted')
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  destroyed() {
    console.log('destroyed')
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
});
</script>
