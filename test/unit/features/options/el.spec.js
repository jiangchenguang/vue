import Vue from "src/entries/web-runtime-with-compiler";

describe("options - el", function (){

  it("basic usage", function (){
    const el     = document.createElement("div");
    el.innerHTML = '<span>{{message}}</span>'
    const vm     = new Vue({
      el  : el,
      data: { message: 'hello world' }
    });
    expect(vm.$el.tagName).toBe('DIV');
    expect(vm.$el.textContent).toBe(vm.message);
  })

  it("should be replaced when use together with 'template' option", function (){
    const el     = document.createElement('p');
    el.innerHTML = '<span>{{message}}</span>';
    const vm     = new Vue({
      el,
      template: `<p id="app"><span>{{message}}</span></p>`,
      data    : { message: 'hello world' }
    });
    expect(vm.$el.tagName).toBe('P');
    expect(vm.$el.textContent).toBe(vm.message);
  })

  it("should be replaced when use together with 'render' option", function (){
    const el     = document.createElement('p');
    el.innerHTML = '<span>{{message}}</span>';
    const vm     = new Vue({
      el,
      render (h){
        return h('p', { staticAttrs: { id: 'app' } }, [
          h('span', {}, [ this.message ])
        ])
      },
      data: { message: 'hello world' }
    })
    expect(vm.$el.tagName).toBe('P');
    expect(vm.$el.textContent).toBe(vm.message);
  })

  xit('svg element', function (){
  })


})
