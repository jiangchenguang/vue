import Vue from "src/core/index";
import VNode, { createEmptyVNode } from "./vnode";
import { normalizeChildren, extractPropsForVnode } from "./helper/index";
import { resolveAsset } from "src/core/util/options";
import { createComponent } from "src/core/vnode/create-component";
import { VNodeData } from "types/vnode";
import { isDef, isPrimitive } from "src/core/util/index";

const SIMPLE_NORMALIZE = 1;
const ALWAYS_NORMALIZE = 2;

export function createElement(
  context: Vue,
  tag: any,
  data: any,
  children: any,
  normalizeType: any,
  alwaysNormalize: boolean
): VNode {

  if (Array.isArray(data)) {
    normalizeType = children;
    children = data;
    data = undefined;
  }

  if (alwaysNormalize) normalizeType = ALWAYS_NORMALIZE;
  return _createElement(context, tag, data, children, normalizeType);
}

function _createElement(
  context: Vue,
  tag?: string,
  data?: VNodeData,
  children?: any,
  normalizeType?: number
): VNode {
  if (!tag) {
    return createEmptyVNode();
  }

  let vnode: VNode;
  let Ctor;

  if (normalizeType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  }

  data = data || {};


  if ((Ctor = resolveAsset(context.$options, "components", tag))) {
    vnode = createComponent(Ctor, data, context, tag);
  } else {
    vnode = new VNode(tag, data, children, undefined, context);
  }
  return vnode;
}