import { Component } from "types/component";

export default class VNode {
  tag?: string;
  data: VNodeData;
  children?: VNode[];
  context?: Component;
  text?: string;
  elm?: Node;
  key?: string;
  ns?: string;

  componentOptions: any;

  constructor(
    tag?: string,
    data?: VNodeData,
    context?: Component,
    children?: VNode[],
    text?: string,
  ) {
    this.tag = tag;
    this.data = data;
    this.context = context;
    this.children = children;
    this.text = text;
    this.key = data && data.key;
  }
}

export function createEmptyVNode(){
  const node = new VNode();
  node.text = "";
  return node;
}

export function createTextVNode(val: string | number): VNode {
  return new VNode(undefined, undefined, undefined, undefined, String(val));
}