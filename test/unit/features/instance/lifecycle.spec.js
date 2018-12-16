import Vue from "src/entries/web-runtime-with-compiler";

describe("instance methods-lifecycle", function (){
  describe('mount', function (){
    it('empty mount', function (){
      const vm = new Vue({
        template: `<div>{{msg}}</div>`,
        data    : {
          msg: 'hello'
        }
      }).$mount();
      expect(vm.$el.tagName).toBe('DIV');
      expect(vm.$el.textContent).toBe('hello');
    })

    it('mount to exiting element', function (){
      const el     = document.createElement('div');
      el.innerHTML = '{{msg}}';
      const vm     = new Vue({
        data: {
          msg: 'hello'
        }
      }).$mount(el);
      expect(vm.$el.tagName).toBe('DIV');
      expect(vm.$el.textContent).toBe('hello');
    })

    it('mount to it', function (){
      const el     = document.createElement('div');
      el.id        = 'mount-test';
      el.innerHTML = '{{msg}}';
      document.body.appendChild(el);
      const vm = new Vue({
        data: { msg: 'hello' }
      }).$mount('#mount-test');
      expect(vm.$el.tagName).toBe('DIV');
      expect(vm.$el.textContent).toBe('hello');
    })
  })

  describe('$destroy', function (){
    xit('remove self from parent', function (){
    })

    it('teardown watchers', function (){
      const vm = new Vue({
        template: `<div></div>`,
        data    : { a: 123 }
      }).$mount();
      vm.$watch('a', () => {});
      expect(vm._watcher.active).toBe(true);
      vm.$destroy();
      expect(vm._watcher.active).toBe(false);
      expect(vm._watchers.every(w => !w.active)).toBe(true);
    })

    it('remove self from data observer', function (){
      const vm = new Vue({ data: { a: 1 } });
      expect(vm.$data.__ob__.vmCount).toBe(1);
      vm.$destroy();
      expect(vm.$data.__ob__.vmCount).toBe(0);
    })

    it('avoid duplicate calls', function (){
      const spy = jasmine.createSpy();
      const vm = new Vue({
        data: {a: 1},
        beforeDestroy: spy
      });
      expect(spy.calls.count()).toBe(0);
      vm.$destroy();
      vm.$destroy();
      expect(spy.calls.count()).toBe(1);
    })
  })

  describe('$forceUpdate', function (){
    it('should force update', function (done){
      const vm = new Vue({
        template: `<div>{{a.b}}</div>`,
        data: {
          a: {}
        }
      }).$mount();
      expect(vm.$el.textContent).toBe('');
      vm.a.b = 'foo';
      waitForUpdate(() => {
        expect(vm.$el.textContent).toBe('');
        vm.$forceUpdate();
      }).then(() => {
        expect(vm.$el.textContent).toBe('foo');
      }).then(done);
    })
  })

  describe('$nextTick', function (){
    it('should be called after dom update in corrent context', function (done){
      const vm = new Vue({
        template: `<div>{{msg}}</div>`,
        data: {
          msg: 'foo'
        }
      }).$mount();
      vm.msg = 'bar';
      vm.$nextTick(function(){
        expect(this).toBe(vm);
        expect(vm.$el.textContent).toBe('bar');
        done();
      })
    })
  })
})
