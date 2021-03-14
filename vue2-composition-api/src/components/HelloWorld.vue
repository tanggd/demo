<template>
  <div class="hello">
    <h1>prop msg: {{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String | Number
  },
  setup(props, context) {
    console.log(props, context)
    const { attrs } = context
    return {
    }
  }
}
</script>
