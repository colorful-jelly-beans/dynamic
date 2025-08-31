import { watch } from "../index.js"

export const addOptionsToElem = (elem, options) => {
    let out = elem
    Object.keys(options).forEach((o) => {
        if (o.startsWith("@")) {
            elem.addEventListener(o.slice(1), options[o])
            out = elem
            return
        }

        if (o.startsWith("_")) {
            const directive = o.slice(1)
            if (directive === "if") {
                const commentNode = document.createComment("_if")
                let node = commentNode

                watch([() => options[o].value], (newValue) => {
                    if (newValue) {
                        node.replaceWith(elem)
                        node = elem
                    } else {
                        node.replaceWith(commentNode)
                        node = commentNode
                    }
                }, true)
                out = node
                return

            }
        }

        if (o === "class") {
            out.classList.add(options[o])
        }
    })

    return out
}