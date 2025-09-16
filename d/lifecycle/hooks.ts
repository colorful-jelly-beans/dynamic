import { UniversalCallback } from "../dom/element";
import { currentComponentID } from "../dom/globals";

export enum HookName {
  OnUnmounted = "onUnmounted",
  OnBeforeMount = "onBeforeMount",
}

const setHook = (hookName: HookName, callback: UniversalCallback) => {
  if (!componentsHooks[currentComponentID]) {
    componentsHooks[currentComponentID] = {};
  }
  componentsHooks[currentComponentID][hookName] = callback;
};

export const onBeforeMount = (callback: UniversalCallback) => {
  setHook(HookName.OnBeforeMount, callback);
};

export const onUnmounted = (callback: UniversalCallback) => {
  setHook(HookName.OnUnmounted, callback);
};

export let componentsHooks: {
  [componentID: number]: {
    [hook in HookName]?: UniversalCallback;
  };
} = {};

export const callComponentHook = (componentID: number, hookName: HookName) => {
  const hookCallback = componentsHooks[componentID][hookName];
  if (hookCallback) {
    hookCallback();
  }
};
