import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

describe("vnode module: dom-props", function (){
  it("should create an element with domProps", function (){
    const vnode = new VNode('a', { domProps: { src: 'http://localhost/' } });
    const elm   = patch(null, vnode);
    expect(elm.src).toBe('http://localhost/');
  })

  it("should change the elements domProps", function (){
    const vnode1 = new VNode('a', { domProps: { src: 'http://localhost/' } });
    const vnode2 = new VNode('a', { domProps: { src: 'https://vuejs.org/' } });
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm.src).toBe('https://vuejs.org/');
  })

  it("should remove the elements domProps", function (){
    const vnode1 = new VNode('a', { domProps: { src: 'http://localhost/' } });
    const vnode2 = new VNode('a', { domProps: {} });
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm.src).toBe('');
  })

  it("should initialize the elements value to zero", function (){
    const vnode = new VNode('input', { domProps: { value: 0 } });
    const elm   = patch(null, vnode);
    expect(elm.value).toBe('0');
  })

  xit("should save raw value on element", function (){
  })

  it("should discard vnode children if the node has innerHTML or textContent as a prop", function (){
    // const vnode1 = new VNode('div', { domProps: { innerHTML: 'hi' } }, [
    //   new VNode('span'), new VNode('span')
    // ]);
    // const elm1   = patch(null, vnode1);
    // expect(elm1.innerHTML).toBe('hi');
    // expect(elm1.children.length).toBe(0);

    const vnode2 = new VNode('div', { domProps: { textContent: 'hi' } }, [
      new VNode('span'), new VNode('span')
    ]);
    // const elm2   = patch(null, vnode2);
    // expect(elm2.textContent).toBe('hi');
    // expect(elm2.children.length).toBe(0);

    const vnode3 = new VNode('div', {}, undefined, '123');
    patch(null, vnode3);
    const elm3 = patch(vnode3, vnode2);
    expect(elm3.textContent).toBe('hi');

  })
})

