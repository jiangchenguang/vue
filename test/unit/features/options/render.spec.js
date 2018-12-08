import Vue from "src/entries/web-runtime-with-compiler";

describe("options - render", function (){
  it('basic usage', function (){
    const vm = new Vue({
      data: {
        items: [ { id: 1, name: 'task1' }, { id: 2, name: 'task2' } ]
      },
      render (h){
        const children = [];
        for (let item of this.items) {
          children.push(h('li', { staticClass: 'task' }, [ item.name ]))
        }


        return h('ul', { staticClass: 'tasks' }, children);
      }
    }).$mount();

    expect(vm.$el.tagName).toBe('UL');
    for (let i = 0; i < vm.$el.children.length; i++) {
      expect(vm.$el.children[i].tagName).toBe('LI');
      expect(vm.$el.children[i].textContent).toBe(vm.items[i].name);
    }
  })

  it('allow null data', function (){
    const vm = new Vue({
      render(h){
        return h('div', null, 'hello world')
      }
    }).$mount();
    expect(vm.$el.tagName).toBe('DIV');
    expect(vm.$el.textContent).toBe('hello world');
  })

  it('should warn non `render` option and non `template` option', function (){
    new Vue({}).$mount();
    expect(`Failed to mount component: template or render function not defined`).toHaveBeenWarned();
  })
})
