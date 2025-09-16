import { computed } from "../reactivity/reactives";
import { watchEffect } from "../reactivity/watchers";
import { ElementContent, HTMLNode } from "./element";

export const addEffectToElementContent = (
  elem: HTMLNode,
  cont: ElementContent,
  propertyToChange: string
) => {
  if (cont === null) return;

  switch (typeof cont) {
    case "string":
      if (propertyToChange in elem) {
        (elem as any)[propertyToChange] = cont;
      }
      break;
    case "object":
      if (propertyToChange in elem) {
        watchEffect(() => {
          (elem as any)[propertyToChange] = cont.value;
        });
      }
      break;
    case "function":
      if (propertyToChange in elem) {
        const comp = computed(cont);
        watchEffect(() => {
          (elem as any)[propertyToChange] = comp.value;
        });
      }
      break;
  }
};
