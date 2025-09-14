import { addEffectToElementContent } from "./content";
import { createScopedStyle, addOptionsToElem, watch, Ref } from "../index";

export type ElementContent = Ref<any> | (() => any) | string | null;

export type UniversalCallback = (...args: any[]) => any;

export type Options = {
  [option in string]: any;
};

export type HTMLNode = HTMLElement | Element | Comment;

type RenderFunction<Props> = (
  props: Props
) => (DocumentFragment | HTMLNode | Text)[];

const setComponentIDDataAttribute = (element: Element, componentID: number) => {
  element.setAttribute(`data-d-${componentID}`, "");
};

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

export enum HookName {
  OnUnmounted = "onUnmounted",
  OnBeforeMount = "onBeforeMount",
}

export let componentsHooks: {
  [componentID: number]: {
    [hook in HookName]?: UniversalCallback;
  };
} = {};

const callComponentHook = (componentID: number, hookName: HookName) => {
  const hookCallback = componentsHooks[componentID][hookName];
  if (hookCallback) {
    hookCallback();
  }
};

export let currentComponentID = 0;

export const mount = <Props>(
  render: RenderFunction<Props>,
  props?: Props,
  options?: Options,
  css?: string,
  componentID = ++currentComponentID
) => {
  if (css) createScopedStyle(css, componentID);

  if (options && "_if" in options) {
    const commentNode = document.createComment("_if");

    const { _if, ...optionsWithoutIf } = options;
    const remount = () =>
      mount(render, props, optionsWithoutIf, css, componentID);

    let node = commentNode;

    watch(
      [() => options["_if"].value],
      (newValue) => {
        if (newValue) {
          let docFragm = remount();
          node.replaceWith(docFragm);
        } else {
          callComponentHook(componentID, HookName.OnUnmounted);
          replaceComponentWithComment(componentID, node);
        }
      },
      false
    );

    if (!options["_if"].value) return node;
  }

  const doc = render(props as Props);

  doc.forEach((el) => {
    if (el instanceof HTMLElement) {
      setComponentIDDataAttribute(el, componentID);
      el.querySelectorAll("*").forEach((element) =>
        setComponentIDDataAttribute(element, componentID)
      );
    }
  });

  const docFragm = document.createDocumentFragment();
  docFragm.replaceChildren(...doc);

  if (options) {
    for (let child of docFragm.children) {
      addOptionsToElem(child, options);
    }
  }

  callComponentHook(componentID, HookName.OnBeforeMount);

  return docFragm;
};

export const mounter = <Props>(render: RenderFunction<Props>, css?: string) => {
  return (props?: Props, options?: Options) =>
    mount(render, props, options, css);
};
