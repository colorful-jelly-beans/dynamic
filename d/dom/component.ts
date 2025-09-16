import { callComponentHook, HookName } from "../lifecycle/hooks";
import { watch } from "../reactivity/watchers";
import { createScopedStyle } from "../style/index";
import {
  HTMLNode,
  Options,
  replaceComponentWithComment,
  setComponentIDDataAttribute,
} from "./element";
import { generateComponentID } from "./globals";
import { addOptionsToElem } from "./options";

export type RenderFunction<Props> = (
  props: Props
) => (DocumentFragment | HTMLNode | Text)[];

export const mount = <Props>(
  render: RenderFunction<Props>,
  props?: Props,
  options?: Options,
  css?: string,
  componentID = generateComponentID()
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
