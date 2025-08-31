import { setActiveEffect } from './globals.js'

export const watchEffect = (callback) => {
    const effect = () => {
        setActiveEffect(effect)
        callback()
        setActiveEffect(null)
    }
    effect()
}

export const watch = (dependencyList, callback, immediate = false) => {
    dependencyList.forEach(dep => {
        let isFirstRun = true
        let previousValue, currentValue
        watchEffect(() => {
            currentValue = dep();
            if ((immediate || !isFirstRun) && (previousValue !== currentValue)) {
                callback(currentValue, previousValue)
            }
            isFirstRun = false
            previousValue = currentValue
        })
    })
}