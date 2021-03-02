<template>
  <div class="home">
    <button @click="onReqJava">请求数据java</button>
    <button @click="onReqNode">请求数据node</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  components: {},
  methods: {
    onReqJava() {
      axios
        .get('/serviceApi/provider/helloProvider')
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onReqNode() {
      axios
        .get('/serviceApi/nacos.provide.nodejs.test/api/getUser')
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  data() {
    return {}
  },
}
</script>
