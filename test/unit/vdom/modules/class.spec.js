import { patch } from "src/platforms/web/runtime/patch";
import VNode, { createTextVNode } from "src/core/vnode/vnode";

describe("vnode module: class", function (){
  it("should create an element with staticClass", function (){
    const vnode = new VNode('p', { staticClass: 'class1' });
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
  })

  it("should create an element with class", function (){
    const vnode = new VNode('p', { class: 'class1' });
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
  })

  it("should crate an element with array class", function (){
    const vnode = new VNode('p', { class: [ 'class1', 'class2' ] });
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
    expect(elm).toHaveClass('class2');
  })

  it("should create an element with object class", function (){
    const vnode = new VNode('p', {
      class: { class1: true, class2: false, class3: true }
    })
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
    expect(elm).not.toHaveClass('class2');
    expect(elm).toHaveClass('class3');
  })

  it("should crate an element with mixed class", function (){
    const vnode = new VNode('p', {
      class: [ { class1: true, class2: false, class3: true }, 'class4', [ 'class5', 'class6' ] ]
    })
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
    expect(elm).not.toHaveClass('class2');
    expect(elm).toHaveClass('class3');
    expect(elm).toHaveClass('class4');
    expect(elm).toHaveClass('class5');
    expect(elm).toHaveClass('class6');
  })

  it("should create an element with staticClass and class", function (){
    const vnode = new VNode('p', { staticClass: 'class1', class: 'class2' });
    const elm   = patch(null, vnode);
    expect(elm).toHaveClass('class1');
    expect(elm).toHaveClass('class2');
  })

  xit("should handle transition class", function (){
  })

  it("should change the elements class", function (){
    const vnode1 = new VNode('p', {
      class: {class1: true, class2: false, class3: true}
    })
    const vnode2 = new VNode('p', {staticClass: 'foo bar'})
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm).not.toHaveClass('class1');
    expect(elm).not.toHaveClass('class2');
    expect(elm).not.toHaveClass('class3');
    expect(elm).toHaveClass('foo');
    expect(elm).toHaveClass('bar');
  })

  it("should remove the elements class", function (){
    const vnode1 = new VNode('p', {
      class: {class1: true, class2: false, class3: true}
    })
    const vnode2 = new VNode('p', {
      class: {}
    })
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm).not.toHaveClass('class1');
    expect(elm).not.toHaveClass('class2');
    expect(elm).not.toHaveClass('class3');
  })


  it("should remove the elements class for without class data", function (){
    const vnode1 = new VNode('p', {
      class: {class1: true, class2: false, class3: true}
    })
    const vnode2 = new VNode('p', {})
    patch(null, vnode1);
    const elm = patch(vnode1, vnode2);
    expect(elm).not.toHaveClass('class1');
    expect(elm).not.toHaveClass('class2');
    expect(elm).not.toHaveClass('class3');
  })

})

