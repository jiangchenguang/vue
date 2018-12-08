import Vue from "src/entries/web-runtime-with-compiler";

describe("options - methods", function (){
  it("should have correct content", function (){
    const vm = new Vue({
      data   : { a: 1 },
      methods: {
        plus (){
          this.a++;
        }
      }
    });

    vm.plus();
    expect(vm.a).toBe(2);
  })

  it('should warn undefined method', function (){
    new Vue({
      methods: {
        plus: null
      }
    })
    expect(`method "plus" has an undefined value`).toHaveBeenWarned();
  })

  it('should warn conflicting data property in methods', function (){
    const vm = new Vue({
      data   : {
        a: 1
      },
      methods: {
        a (){}
      }
    })
    expect(`method "a" has been defined as a data property`).toHaveBeenWarned();
  })
})
