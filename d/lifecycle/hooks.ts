import {
  componentsHooks,
  currentComponentID,
  HookName,
  UniversalCallback,
} from "../dom/elements";

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
