export * from "./element";
export * from "./attrs";

export function query(el: string | Element): Element {
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