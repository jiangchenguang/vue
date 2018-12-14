import Vue from "src/entries/web-runtime-with-compiler";

describe("options - lifeCycle hooks", function (){
  let spy;
  beforeEach(() => {
    spy = jasmine.createSpy('hook');
  })
  it("beforeCreate", function (){
    const vm = new Vue({
      data: {
        a: 1
      },
      beforeCreate (){
        spy();
        expect(this.a).toBeUndefined();
        this.$options.computed = {
          b (){
            return this.a + 1;
          }
        }
      }
    });

    expect(spy).toHaveBeenCalled();
    expect(vm.b).toBe(2);
  })

  it('created', function (){
    const vm = new Vue({
      data: {
        a: 1
      },
      created (){
        expect(this.a).toBe(1);
        spy();
      }
    })
    expect(spy).toHaveBeenCalled();
  })

  it('beforeMount', function (){
    const vm = new Vue({
      render (){},
      beforeMount (){
        spy();
        expect(vm.$el).toBeUndefined();
        expect(vm._isMounted).toBe(false);
        expect(vm._vnode).toBeNull();
        expect(vm._watcher).toBeNull();
      }
    })

    expect(spy).not.toHaveBeenCalled();
    vm.$mount();
    expect(spy).toHaveBeenCalled();
  })

  describe('mounted', function (){
    it('should have mounted', function (){
      const vm = new Vue({
        template: `<div></div>`,
        mounted (){
          spy();
          expect(vm._isMounted).toBe(true);
          expect(vm.$el.tagName).toBe('DIV');
          expect(vm._vnode.tag).toBe('div');
        }
      })

      expect(spy).not.toHaveBeenCalled();
      vm.$mount();
      expect(spy).toHaveBeenCalled();
    })


    xit('should call for manually mounted instance with parent', () => {});

    xit('should mount child parent in correct order', () => {});
  })

  describe('beforeUpdate', function (){
    it('should be called before update', function (done){
      const vm = new Vue({
        template: `<div>{{msg}}</div>`,
        data: {
          msg: 'foo'
        },
        beforeUpdate(){
          spy();
          expect(vm.$el.textContent).toBe('foo')
        }
      }).$mount();

      expect(spy).not.toHaveBeenCalled();
      vm.msg = 'bar';
      expect(spy).not.toHaveBeenCalled();
      waitForUpdate(() => {
        expect(spy).toHaveBeenCalled();
        expect(vm.$el.textContent).toBe('bar');
      }).then(done);
    })
  })

  xdescribe('updated', function (){
  })

  describe('beforeDestroy', function (){
    it('should be called before destroy', ()=> {
      const vm = new Vue({
        render(){},
        beforeDestroy(){
          spy();
          expect(vm._isDestroyed).toBe(false);
        }
      }).$mount();
      expect(spy).not.toHaveBeenCalled();
      vm.$destroy();
      vm.$destroy();
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.count()).toBe(1);
    })
  })

  xit('should emit hook events', function (){
  })
})
