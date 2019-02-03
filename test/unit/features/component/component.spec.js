import Vue from "src/entries/web-runtime-with-compiler";

describe("component", function (){
  it('test', function (){
    const vm = new Vue({
      template  : '<test></test>',
      components: {
        test: {
          template: '<span>{{a}}</span>',
          data (){
            return {
              a: 123
            }
          }
        }
      }
    }).$mount();
    expect(vm.$el.tagName).toBe('SPAN');
    expect(vm.$el.innerHTML).toBe('123');
  })

  it('using component in restricted elements', () => {
    const vm = new Vue({
      template  : '<div><table><tbody><test></test></tbody></table></div>',
      components: {
        test: {
          data (){
            return { a: 123 }
          },
          template: '<tr><td>{{a}}</td></tr>'
        }
      }
    }).$mount()
    expect(vm.$el.innerHTML).toBe('<table><tbody><tr><td>123</td></tr></tbody></table>')
  })

  it('"is" attribute', function (){
    const vm = new Vue({
      template  : '<div><table><tbody><tr is="test"></tr></tbody></table></div>',
      components: {
        test: {
          data (){
            return {
              a: 123
            }
          },
          template: '<tr><td>{{a}}</td></tr>'
        }
      }
    }).$mount();
    expect(vm.$el.innerHTML).toBe('<table><tbody><tr><td>123</td></tr></tbody></table>')
  })

  it('fragment instance warning', function (){
    const vm = new Vue({
      template  : '<test></test>',
      components: {
        test: {
          data (){
            return {
              a: 1,
              b: 2
            }
          },
          template: '<span>{{a}}</span><span>{{b}}</span>'
        }
      }
    }).$mount();
    expect('Component template should contain exactly one root element.').toHaveBeenWarned();
  })

  it('dynamic', function (done){
    const vm = new Vue({
      template  : '<component :is="view" :view="view"></component>',
      data      : { view: 'view-a' },
      components: {
        'view-a': {
          template: '<div>foo {{a}}</div>',
          data (){
            return { a: 'a' }
          }
        },
        'view-b': {
          template: '<div>foo {{b}}</div>',
          data (){
            return { b: 'b' }
          }
        }
      }
    }).$mount();
    expect(vm.$el.outerHTML).toBe('<div view="view-a">foo a</div>')
    vm.view = 'view-b';
    waitForUpdate(() => {
      expect(vm.$el.outerHTML).toBe('<div view="view-b">foo b</div>');
      vm.view = '';
    }).then(() => {
      expect(vm.$el.nodeType).toBe(8);
      expect(vm.$el.data).toBe('');
    }).then(done)
  })

  xit(':is using raw component constructor', function (){
    const vm = new Vue({
      template  : `<div><component :is="$options.components.test"></component></div>`,
      components: {
        test: {
          template: `<span>foo</span>`
        }
      }
    }).$mount();
    expect(vm.$el.innerHTML).toBe('<span>foo</span>');
  })

  xit('dynamic combined with v-for', function (){
  })

  xit('should compile parent template directives & content in parent scope', function (){
  })

  xit('parent content + v-if', function (){
  })

  it('props', function (){
    const vm = new Vue({
      data      : {
        foo: 1
      },
      template  : `<child :foo='foo'></child>`,
      components: {
        child: {
          props   : { foo: Number },
          template: `<span>{{foo}}</span>`,
        }
      }
    }).$mount();
    expect(vm.$el.outerHTML).toBe(`<span>1</span>`)
  })


  xit('should warn when using camelCased props in in-DOM template', () => {
    const vm = new Vue({
      template  : `<test :somefoo='foo'></test>`,
      data      : {
        foo: 1
      },
      components: {
        test: {
          template: `<span>{{someFoo}}</span>`,
          props   : { someFoo: String }
        }
      }
    }).$mount();
    expect(`you should probably use 'some-foo' instead of 'someFoo'.`).toHaveBeenWarned();
  })

  xit('should warn when using camelCased events in in-DOM template', function (){
  })

  it('document', function (){
    new Vue({
      template: `<child></child>`,
      components: {
        child: {
          template: `<div></div>`
        }
      }
    }).$mount();
    expect(1).toBe(1);
  })

  it('properly update replaced higher-order component root node', function (done){
    const vm = new Vue({
      data      : {
        color: 'red'
      },
      template  : `<test id='foo' :class='color'></test>`,
      components: {
        test: {
          data (){
            return { tag: 'div' }
          },
          render (h){
            return h(this.tag, { class: 'test' }, 'hi')
          }
        }
      }
    }).$mount();

    expect(vm.$el.tagName).toBe('DIV');
    expect(vm.$el.id).toBe('foo');
    expect(vm.$el.className).toBe('test red');
    vm.color = 'green';
    waitForUpdate(() => {
      expect(vm.$el.tagName).toBe('DIV');
      expect(vm.$el.id).toBe('foo');
      expect(vm.$el.className).toBe('test green');
      vm.$children[0].tag = 'p';
    }).then(() => {
      expect(vm.$el.tagName).toBe('P');
      expect(vm.$el.id).toBe('foo');
      expect(vm.$el.className).toBe('test green');
      vm.color = 'red';
    }).then(() => {
      expect(vm.$el.tagName).toBe('P');
      expect(vm.$el.id).toBe('foo');
      expect(vm.$el.className).toBe('test red');
    }).then(done)
  })

  xit('catch component render error and preserve previous vnode', function (){
  })
})
