import { Effect } from "./watchers";

export let activeEffect: Effect | null = null;

export const setActiveEffect = (effect: typeof activeEffect) => {
  activeEffect = effect;
};
