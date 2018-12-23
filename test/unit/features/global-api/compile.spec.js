import Vue from "src/entries/web-runtime-with-compiler";

describe("global-api compile", function (){
  it('should compile render functions', function (){
    const res = Vue.compile('<div><span>{{msg}}</span></div>');
    const vm = new Vue({
      data: {
        msg: 'hello'
      },
      render: res.render
    }).$mount();
    expect(vm.$el.innerHTML).toContain('<span>hello</span>');
  })
})
