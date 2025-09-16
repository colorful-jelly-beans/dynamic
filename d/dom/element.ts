import { Ref } from "../reactivity/reactives";
import { addEffectToElementContent } from "./content";
import { addOptionsToElem } from "./options";

export type ElementContent = Ref<any> | (() => any) | string | null;

export type UniversalCallback = (...args: any[]) => any;

export type Options = {
  [option in string]: any;
};

export type HTMLNode = HTMLElement | Element | Comment;

// what if e would return mount func and behave like a component?
export const e = (tag: string, cont: ElementContent, options?: Options) => {
  if (tag === "textNode") {
    const node = document.createTextNode("");
    addEffectToElementContent(node, cont, "textContent");

    return node;
  }

  let elem: HTMLNode = document.createElement(tag);

  const propertyToChange = tag === "input" ? "value" : "innerHTML";

  addEffectToElementContent(elem, cont, propertyToChange);

  if (options) {
    elem = addOptionsToElem(elem, options);
  }

  return elem;
};

export const replaceComponentWithComment = (
  componentID: number,
  commentNode: Comment
) => {
  document.querySelectorAll(`[data-d-${componentID}]`).forEach((el, ind) => {
    if (ind === 0) {
      el.replaceWith(commentNode);
    } else {
      el.remove();
    }
  });
};

export const setComponentIDDataAttribute = (
  element: Element | HTMLElement,
  componentID: number
) => {
  element.setAttribute(`data-d-${componentID}`, "");
};
