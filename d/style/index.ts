export const createScopedStyle = (css: string, componentID: number) => {
  if (!css) return;

  const style = document.createElement("style");

  style.textContent = getScopedCss(css, componentID);
  style.setAttribute("data-d-" + componentID, "");

  document.body.appendChild(style);
};

export const getScopedCss = (css: string, componentID: number) => {
  const selectorPattern = /([^},\n]+?(?=({|,)))/g;

  return css.replace(selectorPattern, `[data-d-${componentID}]$1`);
};
