import { computed, watchEffect } from "../index"

export const addEffectToElementContent = (elem, cont, propertyToChange) => {
    if (cont === null) return

    switch (typeof cont) {
        case "string":
            elem[propertyToChange] = cont
            break
        case "object":
            watchEffect(() => {
                elem[propertyToChange] = cont.value
            })
            break
        case "function":
            const comp = computed(cont)
            watchEffect(() => {
                elem[propertyToChange] = comp.value
            })
            break
    }
}