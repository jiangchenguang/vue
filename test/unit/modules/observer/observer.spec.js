import Vue from "src/entries/web-runtime";
import Dep from "src/core/observer/dep";
import {
  Observer,
  observe,
  set as setProp,
  del as delProp,
} from "src/core/observer";
import {
  hasOwn
} from "src/shared/util";

describe("Observer", function (){
  it("create on none-observables", function (){
    const ob1 = observe(1);
    expect(ob1).toBeUndefined();

    const ob2 = observe(new Vue());
    expect(ob2).toBeUndefined();

    const ob3 = observe(Object.freeze({}));
    expect(ob3).toBeUndefined();
  });

  it("create on object", function (){
    const obj = {
      a: {},
      b: {}
    }
    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    expect(obj.a.__ob__ instanceof Observer).toBe(true);
    expect(obj.b.__ob__ instanceof Observer).toBe(true);

    const ob2 = observe(obj);
    expect(ob1).toBe(ob2);
  })

  it("create on null", function (){
    const obj = Object.create(null);
    obj.a     = {};
    obj.b     = {};

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    expect(obj.a.__ob__ instanceof Observer).toBe(true);
    expect(obj.b.__ob__ instanceof Observer).toBe(true);

    const ob2 = observe(obj);
    expect(ob1).toBe(ob2);
  })

  it("create on already observed obj", function (){
    const obj    = {};
    let value    = 0;
    let getCount = 0;
    Object.defineProperty(obj, "a", {
      enumerable  : true,
      configurable: true,
      get         : function (){
        getCount++;
        return value;
      },
      set         : function (val){
        value = val;
      }
    })

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    getCount = 0;
    obj.a;
    expect(getCount).toBe(1);
    obj.a;
    expect(getCount).toBe(2);
    obj.a = 10;
    expect(value).toBe(10);

    const ob2 = observe(obj);
    expect(ob1).toBe(ob2);
  })

  it("create on property with only getter", function (){
    let obj = {};
    Object.defineProperty(obj, "a", {
      enumerable  : true,
      configurable: true,
      get         : function (){
        return 123;
      }
    })

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    expect(obj.a).toBe(123);

    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    try {
      obj.a = 1;
    } catch (e) {
      expect(obj.a).toBe(123);
    }
  })

  it("create on property with only setter", function (){
    let obj = {};
    let value;
    Object.defineProperty(obj, "a", {
      enumerable  : true,
      configurable: true,
      set         : function (val){
        value = val;
      }
    })

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);

    expect(obj.a).toBe(undefined);

    const ob2 = observe(obj);
    expect(ob2).toBe(ob1);

    obj.a = 123;
    expect(value).toBe(123);
  })

  it("create on property which is marked not configurable", function (){
    const obj = {};
    Object.defineProperty(obj, "a", {
      enumerable  : true,
      configurable: false,
      val         : 22,
    })

    const ob1 = observe(obj);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(obj);
    expect(obj.__ob__).toBe(ob1);
  })

  it("create on array", function (){
    const arr = [ {}, {} ];
    const ob1 = observe(arr);
    expect(ob1 instanceof Observer).toBe(true);
    expect(ob1.value).toBe(arr);
    expect(arr.__ob__).toBe(ob1);

    expect(arr[ 0 ].__ob__ instanceof Observer).toBe(true);
    expect(arr[ 1 ].__ob__ instanceof Observer).toBe(true);
  })

  it("observing object prop change", function (){
    const obj     = { a: { b: 2 }, c: NaN };
    const watcher = {
      deps  : [],
      addDep (dep){
        this.deps.push(dep);
        dep.addSub(this);
      },
      update: jasmine.createSpy()
    }

    const ob1  = observe(obj);
    Dep.target = watcher;
    obj.a.b;
    Dep.target = undefined;
    expect(watcher.deps.length).toBe(3);  // obj.a a a.b
    obj.a.b = 3;
    expect(watcher.update.calls.count()).toBe(1);
    obj.a = { b: 4 };
    expect(watcher.update.calls.count()).toBe(2);

    watcher.deps = [];

    Dep.target = watcher;
    obj.a.b;
    obj.c;
    Dep.target = undefined;
    expect(watcher.deps.length).toBe(4);
    obj.a.b = 5;
    expect(watcher.update.calls.count()).toBe(3);
    obj.c = NaN;
    expect(watcher.update.calls.count()).toBe(3);
  })

  it("observing object prop change on defined property", function (){
    const obj = { val: 2 };
    Object.defineProperty(obj, "a", {
      enumerable  : true,
      configurable: true,
      get (){
        return this.val;
      },
      set (newVal){
        this.val = newVal;
        return this.val;
      }
    })
    const watcher = {
      deps  : [],
      addDep (dep){
        this.deps.push(dep);
        dep.addSub(this);
      },
      update: jasmine.createSpy()
    }

    observe(obj);
    Dep.target = watcher;
    expect(obj.a).toBe(2);
    Dep.target = undefined;
    obj.a      = 3;
    expect(obj.val).toBe(3);
    obj.val = 5;
    expect(obj.val).toBe(5);
  })

  it("observe array mutation", function (){
    const arr = [];
    const ob  = observe(arr);
    const dep = ob.dep;
    spyOn(dep, "notify");
    const objs = [ {}, {}, {} ];
    arr.push(objs[ 0 ]);
    arr.pop();
    arr.unshift(objs[ 1 ]);
    arr.shift();
    arr.splice(0, 0, objs[ 2 ]);
    arr.sort();
    arr.reverse();
    expect(dep.notify.calls.count()).toBe(7);
    objs.forEach(function (obj){
      expect(obj.__ob__ instanceof Observer).toBe(true);
    })
  })

  it("observing set/delete", function (){
    const obj1 = { a: 1 };
    const ob1  = observe(obj1);
    const dep1 = ob1.dep;
    spyOn(dep1, "notify");
    setProp(obj1, "b", 2);
    expect(dep1.notify.calls.count()).toBe(1);
    delProp(obj1, "a");
    expect(hasOwn(obj1, "a")).toBe(false);
    expect(dep1.notify.calls.count()).toBe(2);
    setProp(obj1, "b", 3);
    expect(obj1.b).toBe(3);
    expect(dep1.notify.calls.count()).toBe(2);
    setProp(obj1, "c", 1);
    expect(obj1.c).toBe(1);
    expect(dep1.notify.calls.count()).toBe(3);
    delProp(obj1, "a");
    expect(dep1.notify.calls.count()).toBe(3);

    const obj2 = { a: 1 };
    delProp(obj2, "a");
    expect(hasOwn(obj2, "a")).toBe(false);

    const obj3 = Object.create(null);
    obj3.a = 1;
    const ob3 = observe(obj3);
    const dep3 = ob3.dep;
    spyOn(dep3, "notify");
    setProp(obj3, "b", 2);
    expect(obj3.b).toBe(2);
    expect(dep3.notify.calls.count()).toBe(1);
    delProp(obj3, "a");
    expect(hasOwn(obj3, "a")).toBe(false);
    expect(dep3.notify.calls.count()).toBe(2);
  })
});
