<template>
  <div class="content" ref="root">
    <h1>22</h1>
    <div>
      total: {{ total }}
      <button @click="add">btn +1</button>
    </div>
    <div>total*2: {{ total2 }}</div>
    <HelloWorld msg="hello composition api" str="hi" :num="total" />
  </div>
</template>

<script>
import { computed, ref, onMounted, watch, unref, reactive } from "@vue/composition-api";
import HelloWorld from "@/components/HelloWorld";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  setup() {
    const total = ref(0);
    const root = ref(null);
    const state = reactive({
      name: 'tang',
      age: 18
    })

    // console.log(unref(total))
    // console.log(unref(123456))
    // console.log(unref(state))
    // console.log(state)

    const total2 = computed(() => {
      return total.value * 2;
    });

    watch(total, (v) => {
      console.log('total变化了')
    })

    const add = () => {
      total.value++;
    };

    onMounted(() => {
      // 在渲染完成后, 这个 div DOM 会被赋值给 root ref 对象
      console.log(root.value); // <div/>
    });

    // 暴露给template使用
    return {
      total,
      add,
      total2,
      root
    };
  }
};
</script>
