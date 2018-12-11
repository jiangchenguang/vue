import Vue from "src/entries/web-runtime-with-compiler";

describe("options - computed", function (){
  it("basic usage", function (done){
    const vm = new Vue({
      template: `<div>{{b}}</div>`,
      data    : {
        a: 1
      },
      computed: {
        b (){
          return this.a + 1
        }
      }
    }).$mount();

    expect(vm.b).toBe(2);
    expect(vm.$el.textContent).toBe('2');
    vm.a = 2;
    expect(vm.b).toBe(3);
    waitForUpdate(() => {
      expect(vm.$el.textContent).toBe('3');
    }).then(done)
  })

  it('with set', function (done){
    const vm = new Vue({
      template: `<div>{{b}}</div>`,
      data    : {
        a: 1
      },
      computed: {
        b: {
          get (){return this.a + 1},
          set (v){this.a = v - 1}
        }
      }
    }).$mount();

    expect(vm.b).toBe(2);
    expect(vm.$el.textContent).toBe('2');
    vm.a = 2;
    expect(vm.b).toBe(3);
    waitForUpdate(()=> {
      expect(vm.$el.textContent).toBe('3');
      vm.b = 5;
      expect(vm.a).toBe(4);
    }).then(() => {
      expect(vm.$el.textContent).toBe('5');
    }).then(done)
  })

  it('should warn no getter', function (){
    const vm = new Vue({
      template: `<div>{{b}}</div>`,
      data: {
        a: 1
      },
      computed: {
        b: {
          set(v){this.a = v - 1}
        }
      }
    }).$mount();
    expect('No getter function has defined on computed property:b').toHaveBeenWarned();
  })

  it('watch computed', function (done){
    const spy = jasmine.createSpy('watch computed');
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b() {
          return this.a + 1
        }
      }
    });
    vm.$watch('b', spy);
    vm.a = 2;
    waitForUpdate(()=> {
      expect(spy).toHaveBeenCalledWith(3, 2);
    }).then(done)
  })

  it('should cache value', function (){
    const spy = jasmine.createSpy('cached computed');
    const vm = new Vue({
      data: {
        a: 1
      },
      computed: {
        b(){
          spy();
          return this.a + 1;
        }
      }
    })

    expect(spy).toHaveBeenCalledTimes(0);
    vm.b;
    expect(spy).toHaveBeenCalledTimes(1);
    vm.b;
    expect(spy).toHaveBeenCalledTimes(1);
  })

  xit('as component', function (){
  })

  it('should warn conflict with data', function (){
    new Vue({
      data: {
        a: 1
      },
      computed: {
        a() {
          return 2;
        }
      }
    })

    expect("The computed property 'a' has defined in data").toHaveBeenWarned();
  })

  xit('should warn conflict with props', function (){
  })
})
