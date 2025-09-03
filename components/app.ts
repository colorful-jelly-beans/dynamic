import { route, router, ref, watch, computed, mounter, e } from "../d/index"

import Message from "./message"

const setup = () => {
    const counter = ref(0)
    const inc = () => {
        counter.value++
    }
    const msg = ref("")

    watch([() => msg.value], () => console.log('msg val changed ' + counter.value))

    return { counter, inc, msg }
}

function render() {
    const homeBtn = e("button", 'go home', {
        "@click": () => router.push('/home')
    })

    const welcomeBlock = e("div", () => 'Welcome to the Home Page!', {
        "_if": computed(() => route.value === '/home')
    })

    const counter = e("p", () => 'counter: ' + this.counter.value, {
        "_if": computed(() => this.counter.value % 2 === 0),
        "class": 'counter'
    })

    const msgComponent = Message({ counter: this.counter }, {
        "_if": computed(() => this.counter.value % 4 === 0),
        "@click": this.inc,
        "class": "test",
    })

    const btn = e("button", () => "click me to make " + (this.counter.value + 1), {
        "@click": this.inc
    })

    const inp = e("input", null, {
        "@input": (ev) => {
            this.msg.value = ev.target.value
        }
    })

    const txt = e("p", () => this.msg.value)

    return [homeBtn, welcomeBlock, counter, msgComponent, btn, inp, txt]
}

const hooks = {
    created() {
        console.log('app created')
    },
    beforeMount() {
        console.log('app beforeMount')
    },
}

const css = `
.counter {
    border: 1px solid red;
}
`

export default mounter(setup, render, hooks, css)