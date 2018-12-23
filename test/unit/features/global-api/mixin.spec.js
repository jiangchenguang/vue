import Vue from "src/entries/web-runtime-with-compiler";

describe("global-api mixin", function (){
  let options;
  beforeEach(() => {options = Vue.options});
  afterEach(() => {Vue.options = options});

  it('should work', function (){
    const spy = jasmine.createSpy('global mixin');
    Vue.mixin({
      created (){
        spy(this.$options.myOptions)
      }
    })
    new Vue({
      myOptions: 'hello'
    })
    expect(spy).toHaveBeenCalledWith('hello');
  })

  it('should work for constructors created before mixin is applied', function (){
    const calls = [];
    const Test = Vue.extend({
      name: 'test',
      beforeCreate (){
        calls.push(this.$options.myOption + ' local');
      }
    })
    Vue.mixin({
      beforeCreate(){
        calls.push(this.$options.myOption + ' global');
      }
    })
    expect(Test.options.name).toBe('test');
    new Test({
      myOption: 'hello'
    })
    expect(calls).toEqual(['hello global', 'hello local']);
  })

  xit('should work for global props', function (){
  })

  xit('should not drop last-attached custom options on exiting constructors', function (){
    const baseSpy = jasmine.createSpy('base');
    const Base = Vue.extend({
      beforeCreate: baseSpy
    })

    const Test = Base.extend({});

    Test.options.computed = {
      $style: () => 123
    }

    const spy = jasmine.createSpy('last attached');
    Test.options.beforeCreate = Test.options.beforeCreate.concat(spy);

    const mixinSpy = jasmine.createSpy('mixin');
    Vue.mixin({
      beforeCreate: mixinSpy
    })

    const vm = new Test({
    })
  })

  xit('should not drop original lifecycle hooks', function (){
    const base = jasmine.createSpy('base');
    const Base = Vue.extend({
      beforeCreate: base
    })

    const injected = jasmine.createSpy('injected');
    Base.options.beforeCreate = Base.options.beforeCreate.concat(injected);

    Vue.mixin({});

    new Base({});
    expect(base).toHaveBeenCalled();
    expect(injected).toHaveBeenCalled();
  })
  
})
