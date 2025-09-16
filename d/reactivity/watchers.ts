import { UniversalCallback } from "../dom/element.js";
import { setActiveEffect } from "./globals.js";

export type Effect = () => void;

export const watchEffect = (callback: UniversalCallback) => {
  const effect = () => {
    setActiveEffect(effect);
    callback();
    setActiveEffect(null);
  };
  effect();
};

export const watch = <OldValue, NewValue extends OldValue>(
  dependencyList: (() => NewValue)[],
  callback: (newValue: NewValue, oldValue: OldValue) => void,
  immediate = false
) => {
  dependencyList.forEach((dep) => {
    let isFirstRun = true;
    let previousValue: OldValue, currentValue: NewValue;
    watchEffect(() => {
      currentValue = dep();
      if ((immediate || !isFirstRun) && previousValue !== currentValue) {
        callback(currentValue, previousValue);
      }
      isFirstRun = false;
      previousValue = currentValue;
    });
  });
};
