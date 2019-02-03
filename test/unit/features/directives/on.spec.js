import Vue from "src/entries/web-runtime-with-compiler";

describe("directive v-on", function (){
  let vm, spy, el;

  beforeEach(() => {
    spy = jasmine.createSpy();
    el  = document.createElement('div');
    document.body.appendChild(el);
  })

  afterEach(() => {
    document.body.removeChild(vm.$el);
  })

  it('should bind event to a method', function (){
    vm = new Vue({
      el,
      template: `<div v-on:click="foo"></div>`,
      methods : {
        foo: spy
      }
    })
    triggerEvent(vm.$el, 'click');
    expect(spy.calls.count()).toBe(1);

    const args  = spy.calls.allArgs();
    const event = args[ 0 ] && args[ 0 ][ 0 ] || {};
    expect(event.type).toBe('click')
  });

  it('should bind event to a inline statement', function (){
    vm = new Vue({
      el,
      template: `<div v-on:click=foo(1,2,3,$event)></div>`,
      methods : {
        foo: spy
      }
    })
    triggerEvent(vm.$el, 'click');

    const args      = spy.calls.allArgs();
    const firstArgs = args[ 0 ];
    expect(firstArgs.length).toBe(4);
    expect(firstArgs[ 0 ]).toBe(1);
    expect(firstArgs[ 1 ]).toBe(2);
    expect(firstArgs[ 2 ]).toBe(3);
    expect(firstArgs[ 3 ].type).toBe('click');
  })

  it('should support inline function expression', function (){
    vm = new Vue({
      el,
      template: `<div class="test" @click="function(e){log(e.target.className)}"></div>`,
      methods : {
        log: spy
      }
    });
    triggerEvent(vm.$el, 'click');
    expect(spy).toHaveBeenCalledWith('test');
  })

  it('should support shorthand', function (){
    vm = new Vue({
      el,
      template: `<a href="#test" @click.prevent="foo"></a>`,
      methods : {
        foo: spy
      }
    })
    triggerEvent(vm.$el, 'click');
    expect(spy.calls.count()).toBe(1);
  })

  it('should support stop propagation', function (){
    vm         = new Vue({
      el,
      template: `<div @click.stop="foo"></div>`,
      methods : {
        foo: spy
      }
    })
    const hash = window.location.hash;
    triggerEvent(vm.$el, 'click');
    expect(window.location.hash).toBe(hash);
  })

  it('should support prevent default', function (){
    vm = new Vue({
      el,
      template: `<input type="checkbox" @click.prevent="foo">`,
      methods : {
        foo ($event){
          spy($event.defaultPrevented);
        }
      }
    })

    triggerEvent(vm.$el, 'click');
    expect(spy).toHaveBeenCalledWith(true);
  })

  it('should support capture', () => {
    const callOrder = []
    vm              = new Vue({
      el,
      template: `
        <div @click.capture="foo">
          <div @click="bar"></div>
        </div>
      `,
      methods : {
        foo (){ callOrder.push(1) },
        bar (){ callOrder.push(2) }
      }
    })
    triggerEvent(vm.$el.firstChild, 'click')
    expect(callOrder.toString()).toBe('1,2')
  })

  xit('should support once', function (){
  })

  it('should bind to a child component', function (){
    vm = new Vue({
      el,
      template  : `<child @custom='foo'></child>`,
      methods   : {
        foo: spy
      },
      components: {
        child: {
          template: `<span>hello</span>`
        }
      }
    });
    vm.$children[ 0 ].$emit('custom', 'foo', 'bar');
    expect(spy).toHaveBeenCalledWith('foo', 'bar');
  })

  it('should be able to bind native events for a child component', function (){
    vm = new Vue({
      el,
      template  : `<child @click.native='foo'></child>`,
      methods   : {
        foo: spy
      },
      components: {
        child: {
          template: `<span>hello</span>`
        }
      }
    })
    vm.$children[ 0 ].$emit('click');
    expect(spy).not.toHaveBeenCalled();
    triggerEvent(vm.$children[ 0 ].$el, 'click');
    expect(spy).toHaveBeenCalled();
  })

  xit('.once modifier should work with child components', function (){
  })

  it('remove listener', function (done){
    const spy2 = jasmine.createSpy('remove listener');
    vm         = new Vue({
      el,
      methods: {
        foo: spy, bar: spy2
      },
      data   : {
        ok: true
      },
      render (h){
        return this.ok
          ? h('input', { on: { click: this.foo } })
          : h('input', { on: { input: this.bar } })
      }
    })
    triggerEvent(vm.$el, 'click');
    expect(spy.calls.count()).toBe(1);
    expect(spy2.calls.count()).toBe(0);
    vm.ok = false;
    waitForUpdate(() => {
      triggerEvent(vm.$el, 'click');
      expect(spy.calls.count()).toBe(1);
      triggerEvent(vm.$el, 'input');
      expect(spy2.calls.count()).toBe(1);
    }).then(done)
  })

  xit('remove capturing listener', function (){
  })


  xit('remove once listener', function (){
  })


  xit('remove capturing and once listener', function (){
  })

  it('remove listener on child component', function (done){
    const spy2 = jasmine.createSpy('remove listener');
    vm         = new Vue({
      el,
      methods   : { foo: spy, bar: spy2 },
      data      : {
        ok: true
      },
      components: {
        test: {
          template: '<div></div>'
        }
      },
      render (h){
        return this.ok
          ? h('test', { on: { foo: this.foo } })
          : h('test', { on: { bar: this.bar } })
      }
    })
    vm.$children[ 0 ].$emit('foo');
    expect(spy.calls.count()).toBe(1);
    expect(spy2.calls.count()).toBe(0);
    vm.ok = false;
    waitForUpdate(() => {
      vm.$children[0].$emit('foo');
      expect(spy.calls.count()).toBe(1);
      vm.$children[0].$emit('bar');
      expect(spy2.calls.count()).toBe(1);
    }).then(done)
  })
})
