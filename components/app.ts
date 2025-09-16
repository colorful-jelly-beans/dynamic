import {
  route,
  router,
  ref,
  watch,
  computed,
  mounter,
  e,
  onBeforeMount,
} from "../d/index";

import Message from "./message";

function render() {
  console.log("app created!!");

  onBeforeMount(() => {
    console.log("app onBeforeMount");
  });

  const counter = ref(0);
  const inc = () => {
    counter.value++;
  };
  const msg = ref("");

  watch([() => msg.value], () =>
    console.log("msg val changed " + counter.value)
  );

  const homeBtn = e("button", "go home", {
    "@click": () => router.push("/home"),
  });

  const welcomeBlock = e("div", () => "Welcome to the Home Page!", {
    _if: computed(() => route.value === "/home"),
  });

  const counterText = e("p", () => "counter: " + counter.value, {
    _if: computed(() => counter.value % 2 === 0),
    class: "counter",
  });

  const msgComponent = Message(
    { counter: counter },
    {
      _if: computed(() => counter.value % 4 === 0),
      "@click": inc,
      class: "test",
    }
  );

  const btn = e("button", () => "click me to make " + (counter.value + 1), {
    "@click": inc,
  });

  const inp = e("input", null, {
    "@input": (ev: Event) => {
      const target = ev.target as HTMLInputElement;
      msg.value = target.value;
    },
  });

  const txt = e("p", () => msg.value);

  return [homeBtn, welcomeBlock, counterText, msgComponent, btn, inp, txt];
}

const css = `
.counter {
    border: 1px solid red;
}
`;

export default mounter(render, css);
