<template>
  <div id="app">
    <ul id="nav" class="nav">
      <router-link
        v-for="r in routes"
        :to="r.path"
        :key="r.path"
        tag="li"
        active-class="link-active"
        class="link"
        >{{ r.name }}</router-link
      >
    </ul>
    <div class="container"><router-view /></div>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { routes } from "@/router";
export default defineComponent({
  name: "App",
  setup() {
    return {
      routes: routes.filter(r => r.name)
    };
  }
});
</script>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
  .nav {
    flex: none;
    width: 150px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    .link {
      cursor: pointer;
      padding: 5px 0;
    }
    .link-active {
      color: #0366d6;
      background-color: red;
    }
  }
  .container {
    flex: 1;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    border-left: 1px solid #333;
    padding: 25px;
    box-sizing: border-box;
  }
}
</style>
