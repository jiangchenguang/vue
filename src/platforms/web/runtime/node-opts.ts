import VNode from "src/core/vnode/vnode";

export function createElement(tagName: string, vnode: VNode): HTMLElement {
  return document.createElement(tagName);
}

export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

export function insertBefore(parentNode: Node, newNode: Node, refNode: Node) {
  parentNode.insertBefore(newNode, refNode);
}

export function appendChild(parentNode: Node, newNode: Node) {
  parentNode.appendChild(newNode);
}

