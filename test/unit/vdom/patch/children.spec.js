import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

function prop (name){
  return obj => obj[ name ];
}

const inner = prop("innerHTML");

function map (fn, list){
  const ret = [];
  for (let i = 0; i < list.length; i++) {
    ret.push(fn(list[ i ]));
  }
  return ret;
}

function spanNum (n){
  if (typeof n === 'string') {
    return new VNode('span', {}, null, null, n);
  } else {
    return new VNode('span', { key: n }, null, null, n.toString());
  }
}

describe("vnode patch: children", function (){
  let vnode0;
  beforeEach(function (){
    vnode0 = new VNode("p", {}, null, [ createTextVNode("hello world") ]);
    patch(null, vnode0);
  })

  it("should append children", function (){
    const vnode1 = new VNode("p", null, null, [ 1 ].map(spanNum));
    const vnode2 = new VNode("p", null, null, [ 1, 2, 3 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children[ 0 ].innerHTML).toBe("1");
    expect(elm.children.length).toBe(1);
    elm = patch(vnode1, vnode2);
    expect(elm.children[ 1 ].innerHTML).toBe("2");
    expect(elm.children[ 2 ].innerHTML).toBe("3");
  })

  it("should prepend children", function (){
    const vnode1 = new VNode("p", {}, null, [ 4, 5 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(2);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "2", "3", "4", "5" ]);
  })

  it("should add element in the middle", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 4, 5 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(4);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "2", "3", "4", "5" ]);
  })

  it("should add element at begin and end", function (){
    const vnode1 = new VNode("p", {}, null, [ 2, 3, 4 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(3);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "2", "3", "4", "5" ]);
  })

})
