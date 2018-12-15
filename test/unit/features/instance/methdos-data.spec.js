import Vue from "src/entries/web-runtime-with-compiler";

describe("instance methods-data", function (){
  it('$set/$delete', function (done){
    const vm = new Vue({
      template: `<div>{{a.msg}}</div>`,
      data    : {
        a: {}
      }
    }).$mount();

    expect(vm.$el.innerHTML).toBe('');
    vm.$set(vm.a, 'msg', 'hello');
    waitForUpdate(() => {
      expect(vm.$el.innerHTML).toBe('hello');
      vm.$delete(vm.a, 'msg');
    }).then(() => {
      expect(vm.$el.innerHTML).toBe('');
    }).then(done);
  })

  describe('$watch', function (){
    let vm, spy;
    beforeEach(() => {
      spy = jasmine.createSpy('watch');
      vm  = new Vue({
        data   : {
          a: {
            b: 1
          }
        },
        methods: {
          foo: spy
        }
      })
    })

    it('basic usage', function (done){
      vm.$watch('a.b', spy);
      vm.a.b = 2;
      waitForUpdate(() => {
        expect(spy.calls.count()).toBe(1);
        expect(spy).toHaveBeenCalledWith(2, 1);
        vm.a = { b: 3 }
      }).then(() => {
        expect(spy.calls.count()).toBe(2);
        expect(spy).toHaveBeenCalledWith(3, 2);
      }).then(done);
    })

    it('immediate', function (){
      vm.$watch('a.b', spy, { immediate: true });
      expect(spy.calls.count()).toBe(1);
      expect(spy).toHaveBeenCalledWith(1);
    })

    it('unwatch', function (done){
      const unwatch = vm.$watch('a.b', spy);
      unwatch();
      vm.a.b = 2;
      waitForUpdate(() => {
        expect(spy.calls.count()).toBe(0)
      }).then(done);
    })

    it('function watch', function (done){
      vm.$watch(function (){
        return this.a.b;
      }, spy);
      vm.a.b = 2;
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalledWith(2, 1);
      }).then(done);
    })

    it('deep watch', function (done){
      let oldA = vm.a;
      vm.$watch('a', spy, { deep: true });
      vm.a.b = 2;
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalledWith(oldA, oldA);
        vm.a = { b: 2 };
      }).then(() => {
        expect(spy).toHaveBeenCalledWith(vm.a, oldA);
      }).then(done);
    })

    it('handle option', function (done){
      let oldA = vm.a;
      vm.$watch('a', {
        handler: spy,
        deep   : true,
      })

      vm.a.b = 2;
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalledWith(vm.a, vm.a);
        vm.a = { b: 3 };
      }).then(() => {
        expect(spy).toHaveBeenCalledWith(vm.a, oldA);
      }).then(done);
    })

    it('handle option string', function (){
      vm.$watch('a.b', {
        handler  : 'foo',
        immediate: true
      });
      expect(spy.calls.count()).toBe(1);
      expect(spy).toHaveBeenCalledWith(1)
    })
  })

  xit('warn expression', function (){
  })
})
