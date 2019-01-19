import Vue from "src/entries/web-runtime-with-compiler";

describe("directive v-bind", function (){
  it('normal attr', function (done){
    const vm = new Vue({
      template: `<div><span :test="foo">hello</span></div>`,
      data    : {
        foo: 'ok'
      }
    }).$mount();
    expect(vm.$el.firstChild.getAttribute('test')).toBe('ok');
    vm.foo = 'again';
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('again');
      vm.foo = null;
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('test')).toBe(false);
      vm.foo = false;
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('test')).toBe(false);
      vm.foo = true;
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('true');
      vm.foo = 0;
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('test')).toBe('0');
    }).then(done)
  });

  it('should set property for input value', function (done){
    const vm = new Vue({
      template: `<div><input type="text" :value="foo"><input type="checkbox" :checked="bar"></div>`,
      data    : {
        foo: 'ok',
        bar: false
      }
    }).$mount();
    expect(vm.$el.firstChild.value).toBe('ok');
    expect(vm.$el.lastChild.checked).toBe(false);
    vm.bar = true;
    waitForUpdate(() => {
      expect(vm.$el.lastChild.checked).toBe(true);
    }).then(done)
  })

  xit('xlink', function (){
  })

  it('enumerated attr', function (done){
    const vm = new Vue({
      template: `<div><span :draggable="foo">hello</span></div>`,
      data    : {
        foo: true
      }
    }).$mount();
    expect(vm.$el.firstChild.getAttribute('draggable')).toBe('true');
    vm.foo = 'again';
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('true');
      vm.foo = null;
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('draggable')).toBe('false');
    }).then(done)
  })

  it('boolean attr', function (done){
    const vm = new Vue({
      template: `<div><span :disabled="foo">hello</span></div>`,
      data    : {
        foo: true
      }
    }).$mount();
    expect(vm.$el.firstChild.getAttribute('disabled')).toBe('disabled');
    vm.foo = 'again';
    waitForUpdate(() => {
      expect(vm.$el.firstChild.getAttribute('disabled')).toBe('disabled');
      vm.foo = null;
    }).then(() => {
      expect(vm.$el.firstChild.hasAttribute('disabled')).toBe(false);
      vm.foo = '';
    }).then(() => {
      expect(vm.$el.firstChild.getAttribute('disabled')).toBe('disabled');
    }).then(done)
  })

  it('.prop modifier', function (){
    const vm = new Vue({
      template: `<div><span :text-content.prop="foo"></span><span :inner-html.prop="bar"></span></div>`,
      data    : {
        foo: 'hello',
        bar: '<span>qux</span>'
      }
    }).$mount();
    expect(vm.$el.firstChild.textContent).toBe('hello');
    expect(vm.$el.lastChild.innerHTML).toBe('<span>qux</span>');
  });

  it('.prop modifier with normal attribute binding', function (){
    const vm = new Vue({
      template: `<input :some.prop="some" :id="id">`,
      data    : {
        some: 'hello',
        id  : false
      }
    }).$mount();
    expect(vm.$el.some).toBe('hello');
    expect(vm.$el.getAttribute('id')).toBe(null);
  });

  it('bind object', function (done){
    const vm = new Vue({
      template: `<input v-bind='test'>`,
      data    : {
        test: {
          id   : 'test',
          class: 'ok',
          value: 'hello'
        }
      }
    }).$mount();
    expect(vm.$el.getAttribute('id')).toBe('test');
    expect(vm.$el.getAttribute('class')).toBe('ok');
    expect(vm.$el.value).toBe('hello');

    vm.test.id    = 'hi';
    vm.test.value = 'bye';
    waitForUpdate(() => {
      expect(vm.$el.getAttribute('id')).toBe('hi');
      expect(vm.$el.value).toBe('bye');
    }).then(done)
  })

  it('bind object with overwrite', function (done){
    const vm = new Vue({
      template: `<input v-bind="test" id="foo" :class="test.value">`,
      data    : {
        test: {
          id   : 'test',
          class: 'ok',
          value: 'hello'
        }
      }
    }).$mount();
    expect(vm.$el.getAttribute('id')).toBe('foo');
    expect(vm.$el.getAttribute('class')).toBe('hello');
    expect(vm.$el.value).toBe('hello');

    vm.test.id    = 'hi';
    vm.test.value = 'bye';
    waitForUpdate(() => {
      expect(vm.$el.getAttribute('id')).toBe('foo');
      expect(vm.$el.getAttribute('class')).toBe('bye');
      expect(vm.$el.value).toBe('bye');
    }).then(done);
  })

  it('bind object with class/style', function (done){
    const vm = new Vue({
      template: `<input class="a" style="color:red" v-bind="test">`,
      data    : {
        test: {
          id   : 'test',
          class: [ 'b', 'c' ],
          style: { fontSize: '12px' }
        }
      }
    }).$mount();
    expect(vm.$el.getAttribute('id')).toBe('test');
    expect(vm.$el.getAttribute('class')).toBe('a b c');
    expect(vm.$el.style.color).toBe('red');
    expect(vm.$el.style.fontSize).toBe('12px');

    vm.test.id = 'hi';
    vm.test.class = ['d'];
    vm.test.style = {fontSize: '14px'};
    waitForUpdate(()=> {
      expect(vm.$el.getAttribute('id')).toBe('hi');
      expect(vm.$el.getAttribute('class')).toBe('a d');
      expect(vm.$el.style.color).toBe('red');
      expect(vm.$el.style.fontSize).toBe('14px');
    }).then(done)
  })

  it('bind object with prop', function (done){
    const vm = new Vue({
      template: `<input v-bind.prop="test">`,
      data: {
        test: {
          id: 'test',
          className: 'ok',
          value: 'hello'
        }
      }
    }).$mount();
    expect(vm.$el.id).toBe('test');
    expect(vm.$el.className).toBe('ok');
    expect(vm.$el.value).toBe('hello')
    vm.test.id = 'hi';
    vm.test.className = 'okay';
    vm.test.value = 'bye';
    waitForUpdate(() => {
      expect(vm.$el.id).toBe('hi');
      expect(vm.$el.className).toBe('okay');
      expect(vm.$el.value).toBe('bye');
    }).then(done)
  })


  it('bind array', (done) => {
    const vm = new Vue({
      template: '<input v-bind="test">',
      data    : {
        test: [
          { id: 'test', class: 'ok' },
          { value: 'hello' }
        ]
      }
    }).$mount()
    expect(vm.$el.getAttribute('id')).toBe('test');
    expect(vm.$el.getAttribute('class')).toBe('ok');
    expect(vm.$el.value).toBe('hello')
    vm.test[0].id = 'hi'
    vm.test[1].value = 'bye'
    waitForUpdate(() => {
      expect(vm.$el.getAttribute('id')).toBe('hi');
      expect(vm.$el.value).toBe('bye');
    }).then(done)
  })

  it('warn expect object', () => {
    new Vue({
      template: '<input v-bind="test">',
      data: {
        test: 1
      }
    }).$mount()
    expect('v-bind without argument expects an Object or Array value').toHaveBeenWarned()
  })

})
