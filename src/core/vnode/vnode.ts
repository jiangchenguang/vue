import { Component } from "types/component";

export default class VNode {
  tag: string | void;
  data: VNodeData;
  children?: VNode[];
  context?: Component;
  text?: string;
  elm?: Node;
  ns?: string;

  componentOptions: any;

  constructor(
    tag?: string,
    data?: VNodeData,
    context?: Component,
  ) {
    this.tag = tag;
    this.data = data;
    this.context = context;
  }
}

export function createEmptyVNode(){
  const node = new VNode();
  node.text = "";
  return node;
}