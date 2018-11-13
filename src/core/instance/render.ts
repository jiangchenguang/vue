import { Component } from "types/component";
import { createElement } from "src/core/vnode/create-element";

export function initRender(vm: Component){
  vm.$createElement = (a:string, b?:object) => createElement(vm, a, b, "children");
}