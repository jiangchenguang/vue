export * from "./attrs";
export * from "./class";
export * from "./element";
export * from "./style";

export function query(el: string | HTMLElement): HTMLElement {
  if (typeof el === "string") {
    try {
      return document.querySelector(el);
    } catch (e) {
      return document.createElement("div");
    }
  } else {
    return el;
  }
}