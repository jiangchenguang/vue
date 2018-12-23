import Vue from "src/entries/web-runtime-with-compiler";

describe("global-api set-delete", function (){
  describe('Vue.set', function (){
    it('should update a vue object', function (done){
      const vm = new Vue({
        template: `<div>{{a}}</div>`,
        data    : {
          a: 1
        }
      }).$mount();
      expect(vm.$el.innerHTML).toBe('1');
      Vue.set(vm, 'a', 2);
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('2');
      }).then(done)
    })

    it('should update a observing object', function (done){
      const vm = new Vue({
        template: `<div>{{obj.a}}</div>`,
        data    : {
          obj: { a: 1 }
        }
      }).$mount();
      expect(vm.$el.innerHTML).toBe('1');
      Vue.set(vm.obj, 'a', 2);
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('2');
      }).then(done)
    })

    xit('should update an observing array', function (){
      const vm = new Vue({
        template: `<div><span v-for="(i,j) of arr">{{i}}-{{j}}</span></div>`,
        data    : {
          arr: [ 'a', 'b', 'c' ]
        }
      }).$mount();
      expect(vm.$el.innerHTML).toBe('<span>a-0</span><span>b-1</span><span>c-2</span>');
    })

    it('should update a vue object with nothing', function (done){
      const vm = new Vue({
        template: `<div>{{a}}</div>`,
        data    : {
          a: 1
        }
      }).$mount();
      expect(vm.$el.innerHTML).toBe('1');
      Vue.set(vm, 'a', null);
      waitForUpdate(() => {
        expect(vm.$el.innerHTML).toBe('');
        Vue.set(vm, 'a');
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('');
      }).then(done);
    })

    xit('be able to user string type index in array', function (){
    })
  })

  describe('Vue.delete', function (){
    it('should delete a key', function (done){
      const vm = new Vue({
        template: `<div>{{obj.a}}</div>`,
        data: {
          obj: {a: 1}
        }
      }).$mount();
      expect(vm.$el.innerHTML).toBe('1');
      vm.obj.a = 2;
      waitForUpdate(()=> {
        expect(vm.$el.innerHTML).toBe('2');
        Vue.delete(vm.obj, 'a');
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('');
        vm.obj.a = 3;
      }).then(() => {
        expect(vm.$el.innerHTML).toBe('');
      }).then(done)
    })

    xit('be able to delete an item from Array', function (){
    })
  })
})
