import Vue from "src/core/index";
import { VNodeData } from "types/vnode";

export type VNodeComponentOptions = {
  Ctor: typeof Vue;
  propsData: { [key: string]: any };
  tag: string
}

export default class VNode {
  tag?: string;
  data: VNodeData;
  children?: VNode[];
  context?: Vue;
  text?: string;
  elm?: Node;
  key?: string;
  ns?: string;
  componentOptions?: VNodeComponentOptions;
  componentInstance?: Vue;
  parent?: VNode;
  isComment: boolean;

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: VNode[],
    text?: string,
    context?: Vue,
    componentOptions?: VNodeComponentOptions,
    elm?: Element,
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.context = context;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.elm = elm;
    this.parent = undefined;
  }
}

export function createEmptyVNode(text: string = '') {
  const node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
}

export function createTextVNode(val: string | number): VNode {
  return new VNode(undefined, undefined, undefined, String(val));
}