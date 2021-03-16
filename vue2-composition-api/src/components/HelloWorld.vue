<template>
  <div class="hello">
    <h1>prop msg: {{ msg }}</h1>
    <!-- <h1>{{ num2 }}</h1> -->
  </div>
</template>

<script>
import { toRef } from "@vue/composition-api";
export default {
  name: "HelloWorld",
  props: {
    msg: String | Number,
    // num: Number
  },
  setup(props, context) {
    console.log(props, context);
    const { attrs } = context;
    return {
      // num2: props.num
      // num2: toRef(props, "num")
    };
  }
};
</script>
