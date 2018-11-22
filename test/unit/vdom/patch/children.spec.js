import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

function prop (name){
  return obj => obj[ name ];
}

const inner = prop("innerHTML");
const tag   = prop("tagName");

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

  it("should remove elements from beginning", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 3, 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(5);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "3", "4", "5" ]);
  })

  it("should remove elements from end", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 2, 3 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(5);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "2", "3" ]);
  })

  it("should remove element from middle", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 2, 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(5);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "2", "4", "5" ]);
  })

  it("should move element forward", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3, 4 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 2, 3, 1, 4 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(4);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "2", "3", "1", "4" ]);
  })

  it("should move element to end", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 2, 3, 1 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(3);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "2", "3", "1" ]);
  })

  it("should move element backwards", function (){
    const vnode1 = new VNode("p", {}, null, [ 1, 2, 3, 4 ].map(spanNum));
    const vnode2 = new VNode("p", {}, null, [ 1, 4, 2, 3 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(4);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "1", "4", "2", "3" ]);
  })

  it("should swap first and last", function (){
    const vnode1 = new VNode('p', {}, null, [ 1, 2, 3, 4 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 4, 2, 3, 1 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(4);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ '4', '2', '3', '1' ]);
  })

  it("should move left and replace", function (){
    const vnode1 = new VNode('p', {}, null, [ 1, 2, 3, 4, 5 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 4, 1, 2, 3, 6 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(5);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "4", "1", "2", "3", "6" ]);
  })

  it("should move to left and leaves hold", function (){
    const vnode1 = new VNode('p', {}, null, [ 1, 4, 6 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 4, 5 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(3);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "4", "5" ]);
  })

  it("should handle moved and set to undefined element ending at the end", function (){
    const vnode1 = new VNode('p', {}, null, [ 2, 4, 5 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 4, 5, 3 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(3);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "4", "5", "3" ]);
  })

  it("should move a key in non-keyed node with a size up", function (){
    const vnode1 = new VNode('p', {}, null, [ 1, 'a', 'b', 'c' ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 'd', 'a', 'b', 'c', 1, 'e' ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(4);
    expect(elm.textContent).toBe("1abc");
    elm = patch(vnode1, vnode2);
    expect(elm.textContent).toBe("dabc1e");
  })

  it("should reserve element", function (){
    const vnode1 = new VNode('p', {}, null, [ 1, 2, 3, 4, 5, 6 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 6, 5, 4, 3, 2, 1 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(6);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "6", "5", "4", "3", "2", "1" ])
  })

  it("something", function (){
    const vnode1 = new VNode('p', {}, null, [ 0, 1, 2, 3, 4, 5 ].map(spanNum));
    const vnode2 = new VNode('p', {}, null, [ 4, 3, 2, 1, 5, 0 ].map(spanNum));
    let elm      = patch(vnode0, vnode1);
    expect(elm.children.length).toBe(6);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ "4", "3", "2", "1", "5", "0" ]);
  })

  xit("should handle random shuffle", function (){
  })

  it("should append element with updating children without keys", function (){
    const vnode1 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'hello')
    ]);
    const vnode2 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(map(inner, elm.children)).toEqual([ 'hello' ]);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.children)).toEqual([ 'hello', 'world' ]);
  })

  it("should handle unmoved text node with updating children without keys", function (){
    const vnode1 = new VNode('p', {}, null, [
      createTextVNode('hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    const vnode2 = new VNode('p', {}, null, [
      createTextVNode('hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(elm.childNodes[ 0 ].textContent).toBe('hello');
    elm = patch(vnode1, vnode2);
    expect(elm.childNodes[ 0 ].textContent).toBe('hello');
  })

  it("should handle changing text node with updating children without keys", function (){
    const vnode1 = new VNode('p', {}, null, [
      createTextVNode('hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    const vnode2 = new VNode('p', {}, null, [
      createTextVNode('good'),
      new VNode('span', {}, null, null, 'world')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(elm.childNodes[ 0 ].textContent).toBe('hello');
    elm = patch(vnode1, vnode2);
    expect(elm.childNodes[ 0 ].textContent).toBe('good');
  })

  it("should prepend element with updating children without key", function (){
    const vnode1 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'world')
    ])
    const vnode2 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(map(inner, elm.childNodes)).toEqual([ 'world' ]);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.childNodes)).toEqual([ 'hello', 'world' ]);

  })

  it("should prepend element of different tag type with updating children without key", function (){
    const vnode1 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'world')
    ])
    const vnode2 = new VNode('p', {}, null, [
      new VNode('div', {}, null, null, 'hello'),
      new VNode('span', {}, null, null, 'world')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(map(inner, elm.children)).toEqual([ 'world' ]);
    elm = patch(vnode1, vnode2);
    expect(map(prop("tagName"), elm.childNodes)).toEqual([ 'DIV', "SPAN" ]);
    expect(map(inner, elm.childNodes)).toEqual([ 'hello', 'world' ]);
  })

  it("should remove elements with update children without key", function (){
    const vnode1 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'one'),
      new VNode('span', {}, null, null, 'two'),
      new VNode('span', {}, null, null, 'three')
    ])
    const vnode2 = new VNode('p', {}, null, [
      new VNode('span', {}, null, null, 'one'),
      new VNode('span', {}, null, null, 'three')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(map(inner, elm.childNodes)).toEqual([ 'one', 'two', 'three' ]);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.childNodes)).toEqual([ 'one', 'three' ]);
  })

  it("should remove a single text node with updating children without key", function (){
    const vnode1 = new VNode('p', {}, null, null, 'one');
    const vnode2 = new VNode('p', {});
    let elm      = patch(vnode0, vnode1);
    expect(elm.textContent).toBe('one');
    elm = patch(vnode1, vnode2);
    expect(elm.textContent).toBe('');
  })

  it("should remove a single text node when children are updated", function (){
    const vnode1 = new VNode('div', {}, null, null, 'one');
    const vnode2 = new VNode('div', {}, null, [
      new VNode('div', {}, null, null, 'two'),
      new VNode('span', {}, null, null, 'three')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(elm.textContent).toBe('one');
    elm = patch(vnode1, vnode2);
    expect(map(prop('textContent'), elm.childNodes)).toEqual([ 'two', 'three' ]);
  })

  it("should remove a text node among other elements", function (){
    const vnode1 = new VNode('div', {}, null, [
      createTextVNode('one'),
      new VNode('span', {}, null, null, 'two')
    ])
    const vnode2 = new VNode('div', {}, null, [
      new VNode('div', {}, null, null, 'three')
    ])

    let elm = patch(vnode0, vnode1);
    expect(map(prop('textContent'), elm.childNodes)).toEqual([ 'one', 'two' ])
    elm = patch(vnode1, vnode2);
    expect(elm.children.length).toBe(1);
    expect(elm.childNodes[ 0 ].tagName).toBe('DIV');
    expect(elm.childNodes[ 0 ].textContent).toBe('three');
  })

  it("should reorder elements", function (){
    const vnode1 = new VNode('div', {}, null, [
      new VNode('span', {}, null, null, 'one'),
      new VNode('div', {}, null, null, 'two'),
      new VNode('p', {}, null, null, 'three'),
    ])
    const vnode2 = new VNode('div', {}, null, [
      new VNode('p', {}, null, null, 'three'),
      new VNode('div', {}, null, null, 'two'),
      new VNode('span', {}, null, null, 'one'),
    ])

    let elm = patch(vnode0, vnode1);
    expect(map(inner, elm.childNodes)).toEqual([ 'one', 'two', 'three' ]);
    elm = patch(vnode1, vnode2);
    expect(map(inner, elm.childNodes)).toEqual([ 'three', 'two', 'one' ]);
  })

  it("should handle children with the same key but with different tag", function (){
    const vnode1 = new VNode('div', {}, null, [
      new VNode('div', { key: 1 }, null, null, 'one'),
      new VNode('div', { key: 2 }, null, null, 'two'),
      new VNode('div', { key: 3 }, null, null, 'three'),
      new VNode('div', { key: 4 }, null, null, 'four'),
    ])
    const vnode2 = new VNode('div', {}, null, [
      new VNode('div', { key: 4 }, null, null, 'four'),
      new VNode('span', { key: 3 }, null, null, 'three'),
      new VNode('span', { key: 2 }, null, null, 'two'),
      new VNode('div', { key: 1 }, null, null, 'one')
    ])
    let elm      = patch(vnode0, vnode1);
    expect(map(tag, elm.childNodes)).toEqual([ 'DIV', 'DIV', 'DIV', 'DIV' ]);
    expect(map(inner, elm.childNodes)).toEqual([ 'one', 'two', 'three', 'four' ]);
    elm = patch(vnode1, vnode2);
    expect(map(tag, elm.childNodes)).toEqual([ 'DIV', 'SPAN', 'SPAN', 'DIV' ]);
    expect(map(inner, elm.childNodes)).toEqual([ 'four', 'three', 'two', 'one' ]);
  })

  xit("should handle children with the same tag, same key, but one with data and one without data", function (){
  })

  it("should handle static vnode properly", function (){
    function makeNode(text) {
      return new VNode('div', {}, null, [
        new VNode(null, null, null, null, text)
      ])
    }

    const b = makeNode("B");
    b.isStatic = true;
    b.key = `__static__1`;
    const vnode1 = new VNode('div', {}, null, [makeNode('A'), b, makeNode('C')]);
    const vnode2 = new VNode('div', {}, null, [b]);
    const vnode3 = new VNode('div', {}, null, [makeNode('A'), b, makeNode('C')]);
    let elm = patch(vnode0, vnode1);
    expect(elm.textContent).toBe('ABC');
    elm = patch(vnode1, vnode2);
    expect(elm.textContent).toBe('B')
    elm = patch(vnode2, vnode3);
    expect(elm.textContent).toBe('ABC')
  })
})
