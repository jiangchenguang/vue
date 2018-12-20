import Vue from "src/core/index";

export default class VNode {
  tag?: string;
  data: VNodeData;
  children?: VNode[];
  context?: Vue;
  text?: string;
  elm?: Node;
  key?: string;
  ns?: string;

  componentOptions: any;

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: VNode[],
    text?: string,
    context?: Vue,
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.context = context;
    this.key = data && data.key;
  }
}

export function createEmptyVNode(){
  const node = new VNode();
  node.text = "";
  return node;
}

export function createTextVNode(val: string | number): VNode {
  return new VNode(undefined, undefined, undefined, String(val));
}