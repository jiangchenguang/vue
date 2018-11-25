import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

describe("vnode module: attrs", function (){
  it("should create an element with attrs", function (){
    const vnode = new VNode('p', { attrs: { id: 1, class: 'class1' } });
    const elm   = patch(null, vnode);
    expect(elm.id).toBe('1');
    expect(elm).toHaveClass('class1');
  })

  it('should change the elements attrs', function (){
    const vnode1 = new VNode('p', { attrs: { id: '1', class: 'i am vdom' } });
    const vnode2 = new VNode('p', { attrs: { id: '2', class: 'i am' } });
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm).toHaveClass('i');
    expect(elm).toHaveClass('am');
    expect(elm).not.toHaveClass('vdom');
  })

  it("should remove the element attrs", function (){
    const vnode1 = new VNode('p', { attrs: { id: '1', class: 'i am vdom' } });
    const vnode2 = new VNode('p', { attrs: { id: '1' } });
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm.id).toBe('1');
    expect(elm.className).toBe('');
  })

  it("should remove the element attrs for new nodes without attrs data", function (){
    const vnode1 = new VNode('p', { attrs: { id: '1', class: 'i am vdom' } });
    const vnode2 = new VNode('p', {});
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm.id).toBe('');
    expect(elm.className).toBe('');
  })

  it("should remove the falsy value from boolean attr", function (){
    const vnode = new VNode('option', { attrs: { disabled: null } });
    const elm   = patch(null, vnode);
    expect(elm.getAttribute('disabled')).toBe(null);
  })

  it("should set the attr name to boolean attr", function (){
    const vnode = new VNode('option', { attrs: { disabled: true } });
    const elm   = patch(null, vnode);
    expect(elm.getAttribute('disabled')).toBe('disabled');
  })

  it("should set the falsy value to enumerated attr", function (){
    const vnode = new VNode('div', { attrs: { contenteditable: null } });
    const elm = patch(null, vnode);
    expect(elm.getAttribute('contenteditable')).toBe('false');
  })

  it("should set the boolean string value to enumerated attr", function (){
    const vnode = new VNode('div', {attrs: {contenteditable: 'true'}});
    const elm = patch(null, vnode);
    expect(elm.getAttribute('contenteditable')).toBe('true');
  })

  xit("should set the xlink value to attr", function (){
  })

  xit("should set the xlink boolean string value to attr", function (){
  })

  xit("should handle mutating observed attrs object", function (){
  })

})
