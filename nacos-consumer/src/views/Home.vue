<template>
  <div class="home">
    <button @click="onReq">请求数据</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Home',
  components: {},
  methods: {
    onReq() {
      axios
        .get('/serviceApi/getUser?ID=12345')
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
