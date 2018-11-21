import config from "../config";
import VNode from "src/core/vnode/vnode";
import { NodeOpts } from "types/patch";
import { isPrimitive } from "src/shared/util";

function isUndef(s: any): boolean {
  return s == null;
}

function isDef(s: any): boolean {
  return s != null;
}

function sameVnode(vnode1: VNode, vnode2: VNode) {
  return (
    vnode1.key === vnode2.key &&
    vnode1.tag === vnode2.tag
  )
}

function createOldKey2Idx(vnodes: VNode[], startIdx: number, endIdx: number): { [key: string]: number } {
  let map: { [key: string]: number } = {};
  for (let i = startIdx; i <= endIdx; i++) {
    let vnode = vnodes[i];
    if (isDef(vnode) && isDef(vnode.key)) {
      map[vnode.key] = i;
    }
  }
  return map;
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

  function patchVnode(oldVnode: VNode, vnode: VNode) {
    if (oldVnode === vnode) return;

    let oldCh = oldVnode.children;
    let ch = vnode.children;

    const elm = vnode.elm = oldVnode.elm;

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(<Element>elm, oldCh, ch);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) nodeOpts.setTextContent(elm, "");
        addVnodes(<Element>elm, null, ch, 0, ch.length - 1);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
        console.error("todo clear oldCh");
      } else if (isDef(oldVnode.text)) {
        nodeOpts.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOpts.setTextContent(elm, vnode.text);
    }
  }

  function updateChildren(parentElm: Element, oldCh: VNode[], ch: VNode[]) {
    let oldStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newStartIdx = 0;
    let newEndIdx = ch.length - 1;
    let newStartVnode = ch[0];
    let newEndVnode = ch[newEndIdx];
    let oldKeyToIdx: {[key: string]: number};
    let idxInOld: number;
    let toMoveVnodeInOld: VNode;

    // 使用新的列表去更新旧的列表
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldEndVnode = oldCh[++oldStartIdx];
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // 同一个vnode，仍然在头部
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = ch[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // 同一个vnode，仍然在尾部
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = ch[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // 同一个vnode，跑到尾部去了，同时需要将新节点移动到更新尾节点的前面
        patchVnode(oldStartVnode, newEndVnode);
        nodeOpts.insertBefore(parentElm, oldStartVnode.elm, nodeOpts.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = ch[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // 同一个vnode，跑到头部去了，通过需要将新节点移动到更新头节点的前面（即前面全部已经更新过的vnode）
        patchVnode(oldEndVnode, newStartVnode);
        nodeOpts.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = ch[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createOldKey2Idx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) {
          createElm(newStartVnode, parentElm, oldStartVnode.elm);
        } else {
          toMoveVnodeInOld = oldCh[idxInOld];
          patchVnode(toMoveVnodeInOld, newStartVnode);
          nodeOpts.insertBefore(parentElm, toMoveVnodeInOld.elm, oldStartVnode.elm);
          oldCh[idxInOld] = null;
        }

        newStartVnode = ch[++newStartIdx];
      }
    }

    if (oldStartIdx > oldEndIdx) {
      let refElm = isUndef(ch[newEndIdx + 1]) ? null : ch[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, ch, newStartIdx, newEndIdx);
    } else {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function addVnodes(parentElm: Element, refEle: Node, vnodes: VNode[], startIdx: number, endIdx: number) {
    for (let i = startIdx; i <= endIdx; i++) {
      createElm(vnodes[i], parentElm, refEle);
    }
  }

  function removeVnodes(vnodes: VNode[], startIdx: number, endIdx: number) {
    for (let i = startIdx; i <= endIdx; i++) {
      let vnode = vnodes[i];
      if (isDef(vnode)) {
        removeElm(vnodes[i].elm);
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

  function removeElm(elm: Node) {
    let parent = elm.parentNode;
    if (parent) {
      nodeOpts.removeChild(parent, elm);
    }
  }

  function createChildren(vnode: VNode, children: VNode[]) {
    if (Array.isArray(children)) {
      for (let child of children) {
        createElm(child, vnode.elm, null);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOpts.appendChild(vnode.elm, nodeOpts.createTextNode(vnode.text));
    }
  }

  return function path(oldVnode: VNode, vnode: VNode, parentElm: Element, refEle: Node): Node | void {

    if (!oldVnode) {
      createElm(vnode, parentElm, refEle);
    } else {
      patchVnode(oldVnode, vnode);
    }

    return vnode.elm;
  }

}