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
    if (isDef(tag)) {
      // createElement
      vnode.elm = nodeOpts.createElement(<string>tag, vnode);
      createChildren(vnode, children, vnode.elm);
      insert(parentElm, vnode.elm, refElm);
    } else {
      // 暂时只考虑nodetype 1 或者 3
      vnode.elm = nodeOpts.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createChildren(vnode: VNode, children: VNode[], parentElm: Node) {
    for (let child of children) {
      child.elm = createElm(child, parentElm, null);
    }
  }

  return function path(oldVnode: VNode, vnode: VNode, parentElm: Element, refEle: Node): Node | void {

    if (!oldVnode) {
      createElm(vnode, parentElm, refEle);
    }

    return vnode.elm;
  }

}