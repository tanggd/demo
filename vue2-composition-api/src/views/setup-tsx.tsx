import { defineComponent, ref } from "@vue/composition-api";
export default defineComponent({
  setup() {
    const total = ref(0);
    const add = () => {
      total.value++;
    };

    return () => {
      return (
        <div class="content">
          total: {total.value}
          <button on-click={add}>btn +1</button>
        </div>
      );
    };

    // return (props, slots, attrs, vnode) => {
    //   // console.log(props, slots, attrs, vnode)
    //   return (<div class="content">
    //     total: {total.value}
    //     <button on-click={add}>btn +1</button>
    //   </div>
    // )}
  }
});
