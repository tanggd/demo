<template>
  <div class="content">
    <h1></h1>
    <div>
      total: {{ total }}
      <button @click="add">btn +1</button>
    </div>
    <div>
      total*2: {{ total2 }}
    </div>
    <HelloWorld msg="hello composition api" str="hi" :num="total"/>
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import HelloWorld from '@/components/HelloWorld'

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  setup() {
    const total = ref(0);

    const total2 = computed(() => {
      return total.value * 2
    })

    const add = () => {
      total.value++;
    };

    // 暴露给template使用
    return {
      total,
      add,
      total2
    };
  }
};
</script>
