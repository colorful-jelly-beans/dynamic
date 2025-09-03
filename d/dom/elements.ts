import { addEffectToElementContent } from "./content"
import { createScopedStyle, addOptionsToElem, watch } from "../index"

export const e = (tag, cont, options) => {
    if (tag === "textNode") {
        const node = document.createTextNode("")
        addEffectToElementContent(node, cont, "textContent")

        return node
    }

    let elem = document.createElement(tag)
    const propertyToChange = tag === "input" ? "value" : "innerHTML"

    addEffectToElementContent(elem, cont, propertyToChange)

    if (options) {
        elem = addOptionsToElem(elem, options)
    }

    return elem
}

export const replaceComponentWithComment = (componentID, commentNode) => {
    document.querySelectorAll(`[data-d-${componentID}]`).forEach((el, ind) => {
        if (ind === 0) {
            el.replaceWith(commentNode)
        } else {
            el.remove()
        }
    })
}

let ctx
export const mount = (setup, render, props, options, hooks, css, componentID = crypto.randomUUID()) => {
    createScopedStyle(css, componentID)

    if (options && "_if" in options) {
        const commentNode = document.createComment("_if")

        const { _if, ...optionsWithoutIf } = options
        const remount = () => mount(setup, render, props, optionsWithoutIf, hooks, css, componentID)

        let node = commentNode

        watch([() => options["_if"].value], (newValue) => {
            if (newValue) {
                let docFragm = remount()
                node.replaceWith(docFragm)
            } else {
                if ('unmounted' in hooks) {
                    hooks.unmounted.call(ctx)
                }
                replaceComponentWithComment(componentID, node)
            }
        }, false)

        if (!options["_if"].value) return node
    }

    if ('created' in hooks)
        hooks.created()

    ctx = { ...props, ...setup(props) }

    let doc = render
        .call(ctx)
        .filter(el => el !== null)

    doc.forEach(el => {
        if (el instanceof HTMLElement) {
            el.setAttribute("data-d-" + componentID, "")
        }
    })

    const docFragm = document.createDocumentFragment()
    docFragm.replaceChildren(...doc)

    if (options) {
        for (let child of docFragm.children) {
            addOptionsToElem(child, options)
        }
    }

    if ('beforeMount' in hooks) {
        hooks.beforeMount.call(ctx)
    }

    return docFragm
}

export const mounter = (setup, render, hooks, css) => {
    return (props, options) => mount(setup, render, props, options, hooks, css)
}