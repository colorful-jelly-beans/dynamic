import { e, mounter } from "../d/index"

const setup = (): void => { }

function render() {
    const m = e("p", "hi", {
        "class": "yo"
    })

    const t = e("p", () => this.counter.value, {
        "class": "hey"
    })

    return [m, t]
}

const hooks = {
    created() {
        console.log('msg created')
    },
    beforeMount() {
        console.log('msg beforeMount', this.counter.value)
    },
    unmounted() {
        console.log('msg unmounted', this.counter.value)
    }
}

export default mounter(setup, render, hooks)