import { Component } from "types/component";
import { createElement } from "src/core/vnode/create-element";

export function initRender(vm: Component){
  vm.$createElement = (a:string, b?:object, c?: any[]) => createElement(vm, a, b, c, "type", true);
}