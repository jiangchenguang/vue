import VNode, { createTextVNode } from "src/core/vnode/vnode";
import { isPrimitive } from "src/shared/util";


export function normalizeChildren(children: any): VNode[] {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined;
}

function normalizeArrayChildren(children: any[], nestedIndex?: string): VNode[] {
  const res: VNode[] = [];
  for (let i = 0, len = children.length; i < len; i++) {
    let child = children[i];
    if (child == null || typeof child === 'boolean') continue;

    if (Array.isArray(child)) {
      res.push.apply(res, normalizeArrayChildren(child, `${nestedIndex || ''}_${i}`))
    } else if (isPrimitive(child)) {
      res.push(createTextVNode(child))
    } else {
      res.push(child);
    }
  }

  return res;
}
