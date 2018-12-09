import Vue from "src/entries/web-runtime-with-compiler";

describe("options - watch", function (){
  let spy;
  beforeEach(function (){
    spy = jasmine.createSpy('watch');
  })

  it("basic usage", function (done){
    const vm = new Vue({
      data : {
        a: 1
      },
      watch: {
        a: spy
      }
    });

    expect(spy).not.toHaveBeenCalled();
    vm.a = 2;
    expect(spy).not.toHaveBeenCalled();
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(2, 1);
    }).then(done)
  })

  it('string method name', function (done){
    const vm = new Vue({
      data   : {
        a: 1
      },
      watch  : {
        a: 'onChange'
      },
      methods: {
        onChange: spy
      }
    })

    expect(spy).not.toHaveBeenCalled();
    vm.a = 2;
    expect(spy).not.toHaveBeenCalled();
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(2, 1);
    }).then(done)
  })

  it('with option immediate', function (done){
    const vm = new Vue({
      data : {
        a: 1
      },
      watch: {
        a: {
          handler  : spy,
          immediate: true
        }
      }
    })

    expect(spy).toHaveBeenCalledWith(1);
    vm.a = 2;
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(2, 1);
    }).then(done)
  })

  it('with option deep', function (done){
    const vm = new Vue({
      data : {
        a: { b: 1 }
      },
      watch: {
        a: {
          handler: spy,
          deep   : true
        }
      }
    });

    const oldA = vm.a;
    expect(spy).not.toHaveBeenCalled();
    vm.a.b = 2;
    expect(spy).not.toHaveBeenCalled();
    waitForUpdate(() => {
      expect(spy).toHaveBeenCalledWith(vm.a, vm.a);
      vm.a = { b: 3 };
    }).then(() => {
      expect(spy).toHaveBeenCalledWith(vm.a, oldA);
    }).then(done)
  })

  xit('multi cbs (after options merge)', function (done){
  })

  xit('merge multi extends', function (){
  })
})
