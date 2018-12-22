import Vue from "src/entries/web-runtime-with-compiler";

describe("global-api extend", function (){
  it('should correctly merge options', function (){
    const Test = Vue.extend({
      name: 'test',
      a   : 1,
      b   : 2
    })
    expect(Test.options.a).toBe(1);
    expect(Test.options.b).toBe(2);
    expect(Test.super).toBe(Vue);
    const t = new Test({
      a: 2
    })
    expect(t.$options.a).toBe(2);
    expect(t.$options.b).toBe(2);
    const Test2 = Test.extend({
      a: 2
    });
    expect(Test2.options.a).toBe(2);
    expect(Test2.options.b).toBe(2);
    const t2 = new Test2({
      a: 3
    })
    expect(t2.$options.a).toBe(3);
    expect(t2.$options.b).toBe(2);
  })

  xit('should work when used as components', function (){
  })

  it('should merge lifecycle hooks', function (){
    const calls = [];
    const A     = Vue.extend({
      created (){
        calls.push(1);
      }
    })
    const B     = A.extend({
      created (){
        calls.push(2);
      }
    })
    new B({
      created (){
        calls.push(3);
      }
    })
    expect(calls).toEqual([ 1, 2, 3 ])
  })

  it('should merge methods', function (){
    const A = Vue.extend({
      methods: {
        a (){return this.n}
      }
    })
    const B = A.extend({
      methods: {
        b (){return this.n + 1}
      }
    })
    const b = new B({
      data   : { n: 1 },
      methods: {
        c (){return this.n + 2}
      }
    })
    expect(b.a()).toBe(1);
    expect(b.b()).toBe(2);
    expect(b.c()).toBe(3);
  })

  xit('should merge assets', function (){
  })

  it('caching', function (){
    const options = {
      template: `<div></div>`
    }
    const A       = Vue.extend(options);
    const B       = Vue.extend(options);
    expect(A).toBe(B)
  })

  it('extended options should use different identify from parent', function (){
    const A              = Vue.extend({ computed: {} });
    const B              = A.extend({});
    B.options.computed.b = () => 'foo';
    expect(A.options.computed).not.toBe(B.options.computed);
    expect(A.options.computed.b).toBeUndefined();
  })
})
