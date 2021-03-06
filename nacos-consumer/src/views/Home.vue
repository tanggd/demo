<template>
  <div class="home">
    <button @click="onReqJava">统一网关 to java</button>
    <button @click="onReqNode">统一网关 to node</button>
    <button @click="onReq">普通的请求</button>
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
        .get('/serviceApi/nacos.provide.nodejs.test/getUser')
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onReq() {
      axios
        .get('/api/nacos.provide.nodejs.test/getUser')
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
