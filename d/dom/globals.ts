export let currentComponentID = 0;

export const generateComponentID = () => {
  return ++currentComponentID;
};
