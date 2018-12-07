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

  xit('should merge data properly', function (){
  })

  xit('should warn no-function during extend', function (){
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

  xit('should have access to method', function (){
  })
})
