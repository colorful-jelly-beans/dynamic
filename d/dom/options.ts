import { watch } from "../reactivity/watchers";
import {
  currentComponentID,
  HTMLNode,
  Options,
  setComponentIDDataAttribute,
} from "./elements";

export const addOptionsToElem = (elem: HTMLNode, options: Options) => {
  let out = elem;
  Object.keys(options).forEach((o) => {
    if (o.startsWith("@")) {
      elem.addEventListener(o.slice(1), options[o]);
      out = elem;
      return;
    }

    if (o.startsWith("_")) {
      const directive = o.slice(1);
      if (directive === "if") {
        const commentNode = document.createComment("_if");
        let node: HTMLNode = commentNode;
        const componentID = currentComponentID;

        watch(
          [() => options[o].value],
          (newValue) => {
            if (newValue) {
              if (elem instanceof Element || elem instanceof HTMLElement) {
                setComponentIDDataAttribute(elem, componentID);
              }

              node.replaceWith(elem);
              node = elem;
            } else {
              node.replaceWith(commentNode);
              node = commentNode;
            }
          },
          true
        );
        out = node;
        return;
      }
    }

    if (o === "class" && "classList" in out) {
      out.classList.add(options[o]);
    }
  });

  return out;
};
