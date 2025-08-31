import { ref } from "../index.js"

export const route = ref(window.location.pathname)

export const router = {
    push(location) {
        route.value = location
        history.pushState({}, '', location)
    }
}

window.addEventListener("popstate", () => {
    route.value = document.location.pathname
});