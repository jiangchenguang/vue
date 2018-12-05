import Vue from "src/entries/web-runtime";
import Watcher from "src/core/observer/watcher";

describe("Watcher", function (){
  let vm, spy;

  beforeEach(function (){
    vm  = new Vue({
      template: `<div></div>`,
      data    : {
        a  : 1,
        b  : {
          c: 2,
          d: 4,
        },
        e  : "c",
        msg: "yo"
      }
    }).$mount();
    spy = jasmine.createSpy("watcher");
  })

  it("path", function (done){
    const watch = new Watcher(vm, "b.c", spy);
    expect(watch.value).toBe(2);
    vm.b.c = 3;
    waitForUpdate(function (){
      expect(watch.value).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, 2);
      vm.b = { c: 4 };
    }).then(function (){
      expect(watch.value).toBe(4);
      expect(spy).toHaveBeenCalledWith(4, 3);
    }).end(done);
  })

  it("non-existent path, set later", function (done){
    const watcher = new Watcher(vm, "b.e", spy);
    expect(watcher.value).toBeUndefined();
    Vue.set(vm.b, "e", 123);
    waitForUpdate(function (){
      expect(watcher.value).toBe(123);
      expect(spy.calls.count()).toBe(1);
    }).end(done);
  })

  it("delete", function (done){
    const watcher = new Watcher(vm, "b.c", spy);
    expect(watcher.value).toBe(2);
    Vue.delete(vm.b, "c");
    waitForUpdate(function (){
      expect(watcher.value).toBeUndefined();
      expect(spy).toHaveBeenCalledWith(undefined, 2);
    }).end(done);
  })

  it("path containing $data", function (done){
    const watcher = new Watcher(vm, "$data.b.c", spy);
    expect(watcher.value).toBe(2);
    vm.b = { c: 3 };
    waitForUpdate(function (){
      expect(watcher.value).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, 2);
      vm.b.c = 4;
    }).then(function (){
      expect(watcher.value).toBe(4);
      expect(spy).toHaveBeenCalledWith(4, 3);
    }).end(done)
  })

  it("deep watch", function (done){
    let oldB
    new Watcher(vm, "b", spy, { deep: true });
    vm.b.c = { d: 4 }
    waitForUpdate(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      oldB = vm.b;
      vm.b = { c: [ { a: 1 } ] }
    }).then(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, oldB);
      expect(spy.calls.count()).toBe(2);
      vm.b.c[ 0 ].a = 2;
    }).then(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy.calls.count()).toBe(3);
    }).end(done)
  })

  it("deep watch $data", function (done){
    new Watcher(vm, "$data", spy, { deep: true });
    vm.b.c = 3;
    waitForUpdate(function (){
      expect(spy).toHaveBeenCalledWith(vm.$data, vm.$data);
    }).end(done);
  })

  it("deep watch with circular references", function (done){
    new Watcher(vm, "b", spy, { deep: true });
    Vue.set(vm.b, "_", vm.b);
    waitForUpdate(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy.calls.count()).toBe(1);
      vm.b._.c = 1;
    }).then(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy.calls.count()).toBe(2);
    }).end(done);
  })

  it("first change for prop addition/deletion in non-deep mode", function (done){
    new Watcher(vm, "b", spy);
    Vue.set(vm.b, "e", 123);
    waitForUpdate(function (){
      expect(spy).toHaveBeenCalledWith(vm.b, vm.b);
      expect(spy.calls.count()).toBe(1);
      Vue.delete(vm.b, "e");
    }).then(function (){
      expect(spy.calls.count()).toBe(2);
    }).end(done)
  })

  it("watch function", function(done){
    const watcher = new Watcher(vm, function(){
      return this.a + this.b.d;
    }, spy);

    expect(watcher.value).toBe(5);
    vm.a = 2;
    waitForUpdate(function(){
      expect(spy).toHaveBeenCalledWith(6, 5);
      vm.b = {d:2};
    }).then(function(){
      expect(spy).toHaveBeenCalledWith(4, 6);
    }).end(done);
  })

  it("lazy mode", function (done){
    const watcher = new Watcher(vm, function(){
      return this.a + this.b.d
    }, null, {lazy: true});

    expect(watcher.lazy).toBe(true);
    expect(watcher.value).toBeUndefined();
    expect(watcher.dirty).toBe(true);
    watcher.evaluate();
    expect(watcher.value).toBe(5);
    expect(watcher.dirty).toBe(false);
    vm.a = 2;
    waitForUpdate(function(){
      expect(watcher.value).toBe(5);
      expect(watcher.dirty).toBe(true);
      watcher.evaluate();
      expect(watcher.value).toBe(6);
      expect(watcher.dirty).toBe(false);
    }).end(done);
  })

  xit("tear down", function(){})

  xit("warn not support path", function(){
    new Watcher(vm, "d.e + c", spy);
  })

})
