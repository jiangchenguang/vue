import Vue from "src/entries/web-runtime-with-compiler";

describe("instance properties", function (){
  it('$data', function (){
    const data = { a: 1 };
    const vm   = new Vue({
      data
    })
    expect(vm.a).toBe(1);
    expect(vm.$data).toBe(data);
    // vm -> data
    vm.a = 2;
    expect(data.a).toBe(2);
    // data -> vm
    data.a = 3;
    expect(vm.a).toBe(3);
  })

  it('$options', function (){
    const vm = new Vue({
      methods: {
        b (){}
      }
    })
    expect(typeof vm.$options.methods.b).toBe('function')
  })

  xit('$root/$children', function (){
  })

  xit('$parent', function (){
  })

  xit('$props', function (){
  })

  xit('warn mutating $props', function (){
  })

  xit('$attrs', function (){
  })

  xit('warn mutating $attrs', function (){
  })

  xit('$listeners', function (){
  })

  xit('warn mutating $listeners', function (){
  })
})
