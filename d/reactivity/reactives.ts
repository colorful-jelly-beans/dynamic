import { activeEffect } from "./globals"
import { watchEffect } from "./watchers"

export const ref = (val) => {
    let innerValue = val
    const dependentEffects = new Set()
    const refObj = {
        get value() {
            if (activeEffect) {
                dependentEffects.add(activeEffect)
            }
            return innerValue
        },
        set value(newVal) {
            innerValue = newVal
            for (const dependentEffect of dependentEffects) {
                dependentEffect()
            }
        }
    }

    return refObj
}

export const computed = (callback) => {
    const state = ref()
    watchEffect(() => {
        state.value = callback()
    })

    return state
}