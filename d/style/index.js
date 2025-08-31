export const createScopedStyle = (css, componentID) => {
    if (!css) return

    const style = document.createElement('style')

    style.textContent = getScopedCss(css, componentID)
    style.setAttribute('data-d-' + componentID, '')

    document.body.appendChild(style)
}

export const getScopedCss = (cssString, componentID) => {
    const selectorPattern = /([^},\n]+?(?=({|,)))/g

    return cssString.replaceAll(selectorPattern, `[data-d-${componentID}]$1`)
}