import { e, mounter, onBeforeMount, onUnmounted, Ref } from "../d/index";

interface P {
  counter: Ref<number>;
}

function render(props: P) {
  console.log("msg created!!");

  onBeforeMount(() => {
    console.log("msg onBeforeMount", props.counter.value);
  });

  onUnmounted(() => {
    console.log("msg onUnmounted", props.counter.value);
  });

  const m = e("p", "hi", {
    class: "yo",
  });

  const t = e("p", () => props.counter.value, {
    class: "hey",
  });

  return [m, t];
}

export default mounter(render);
