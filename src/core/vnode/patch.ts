import config from "../config";
import VNode from "src/core/vnode/vnode";
import { NodeOpts } from "types/patch";

function isUndef(s: any): boolean {
  return s == null;
}

function isDef(s: any): boolean {
  return s != null;
}


export function createPathFunction(nodeOpts: NodeOpts) {
  function insert(parent: Node, elm: Node, ref?: Node) {
    if (parent) {
      if (ref) {
        nodeOpts.insertBefore(parent, elm, ref);
      } else {
        nodeOpts.appendChild(parent, elm);
      }
    }
  }

  function createElm(vnode: VNode, parentElm: Node, refElm: Node) {
    const children = vnode.children;
    const tag = vnode.tag;
    // 暂时只考虑nodeType 1 或者 3
    if (isDef(tag)) {
      if (!vnode.ns && config.isUnknownElement(vnode.tag)) {
        console.error(`Unknown custom element: <${vnode.tag}>!`);
      }

      vnode.elm = nodeOpts.createElement(<string>tag, vnode);
      createChildren(vnode, children);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOpts.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createChildren(vnode: VNode, children: VNode[]) {
    if (Array.isArray(children)) {
      for (let child of children) {
        createElm(child, vnode.elm, null);
      }
    }
  }

  return function path(oldVnode: VNode, vnode: VNode, parentElm: Element, refEle: Node): Node | void {

    if (!oldVnode) {
      createElm(vnode, parentElm, refEle);
    }

    return vnode.elm;
  }

}