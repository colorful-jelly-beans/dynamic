import { UniversalCallback } from "../dom/elements";
import { activeEffect } from "./globals";
import { Effect, watchEffect } from "./watchers";

export type Ref<T> = {
  value: T;
};

export function ref<T>(val: T): Ref<T>;
export function ref(): Ref<undefined>;
export function ref<T>(val?: T): Ref<T | undefined> {
  let innerValue = val;
  const dependentEffects = new Set<Effect>();
  const refObj = {
    get value() {
      if (activeEffect) {
        dependentEffects.add(activeEffect);
      }
      return innerValue;
    },
    set value(newVal) {
      innerValue = newVal;
      for (const dependentEffect of dependentEffects) {
        dependentEffect();
      }
    },
  };

  return refObj;
}

export const computed = (callback: UniversalCallback) => {
  const state = ref();
  watchEffect(() => {
    state.value = callback();
  });

  return state;
};
