import Vue from "./vue";
import VNode from "src/core/vnode/vnode";
import { Component } from "types/component";

export type ComponentOptions = {
  data?: object | Function;
  watch?: { [key: string]: Function | string };
  methods?: { [key: string]: Function };

  el?: string | Element;
  render?: (h: () => VNode) => VNode;

  components?: {[index: string]: Component}
}


