import VNode, { createEmptyVNode } from "./vnode";
import { resolveAsset } from "src/core/util/index";
import { Component } from "types/component";

export function createElement(
  context: Component,
  tag: any,
  data: any,
  children: any,
): VNode {

  return _createElement(context, tag, data, children);
}

function _createElement(
  context: Component,
  tag?: string,
  data?: VNodeData,
  children?: any,
): VNode {
  if (!tag) {
    return createEmptyVNode();
  }

  let vnode: VNode;
  let Ctor;

  // todo 在option没有合并前临时附加components属性
  context.$options.components || (context.$options.components = {});
  if ((Ctor = resolveAsset(context.$options, "components", tag))) {

  }

  return new VNode(tag, data, context);
}