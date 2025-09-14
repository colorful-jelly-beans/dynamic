import { ref } from "../reactivity/reactives";

export const route = ref(window.location.pathname);

export const router = {
  push(location: string) {
    route.value = location;
    history.pushState({}, "", location);
  },
};

window.addEventListener("popstate", () => {
  route.value = document.location.pathname;
});
