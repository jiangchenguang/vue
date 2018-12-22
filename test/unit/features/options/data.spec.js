import Vue from "src/entries/web-runtime-with-compiler";

describe("options - data", function (){

  it("should proxy and be reactive", function (done){
    const data = { message: 'hello world' };
    const vm   = new Vue({
      template: `<div>{{message}}</div>`,
      data
    }).$mount();

    expect(vm.$data).toEqual({ message: 'hello world' });
    expect(vm.$data).toBe(data);
    data.message = 'foo';
    waitForUpdate(() => {
      expect(vm.$el.textContent).toBe('foo');
    }).then(done)
  })

  it('should merge data properly', function (){
    const Test = Vue.extend({
      data (){
        return {
          a: 1
        }
      }
    })
    let vm     = new Test({
      data: {
        b: 2
      }
    })
    expect(vm.a).toBe(1);
    expect(vm.b).toBe(2);
    vm = new Test();
    expect(vm.a).toBe(1);
    const Extended = Test.extend({});
    vm             = new Extended();
    expect(vm.a).toBe(1);

    const WithObject = Vue.extend({
      data (){
        return {
          obj: {
            a: 1
          }
        }
      }
    })
    vm = new WithObject({
      data: {
        obj: {
          b: 2
        }
      }
    })
    expect(vm.obj.a).toBe(1);
    expect(vm.obj.b).toBe(2);
  })

  it('should warn no-function during extend', function (){
    Vue.extend({
      data: {a: 1}
    })
    expect('the "data" option should be a function').toHaveBeenWarned();
  })

  it('should warn non object return', function (){
    new Vue({
      data (){}
    })
    expect('data functions should return an object').toHaveBeenWarned();
  })

  it('should warn replacing root $data', function (){
    let data = { msg: 'hello world' };
    const vm = new Vue({
      data
    })
    vm.$data = {};
    expect(`Avoid replacing instance root $data`).toHaveBeenWarned();
  })

  xit('should have access to prop', function (){
  })

  it('should have access to method', function (){
    const vm = new Vue({
      data (){
        return this.get()
      },
      methods: {
        get (){
          return { a: 1 };
        }
      }
    })

    expect(vm.a).toBe(1);
  })
})
