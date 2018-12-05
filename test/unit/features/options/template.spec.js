import Vue from "src/entries/web-runtime-with-compiler";

describe("options - template", function (){

  it("basic usage", function (){
    const vm = new Vue({
      template: '<div>{{message}}</div>',
      data: {message: 'hello world'}
    }).$mount();
    expect(vm.$el.tagName).toBe('DIV');
    expect(vm.$el.textContent).toBe('hello world');
  })

  it("dom element", function (){
    const elm = document.createElement('p');
    elm.innerHTML = '<p>{{message}}</p>';
    const vm = new Vue({
      template: elm,
      data: {message: 'hello world'}
    }).$mount();
    expect(vm.$el.tagName).toBe('P');
    expect(vm.$el.textContent).toBe('hello world');
  })
})
