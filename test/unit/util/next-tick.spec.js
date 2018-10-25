import {
  hasPromise,
  nextTick,
} from "src/core/util";

describe("nextTick", function (){
  it("accept a callback", function (done){
    nextTick(done);
  })

  it("return undefined when pass a callback", function (){
    expect(nextTick(() => {})).toBeUndefined();
  })

  if (hasPromise) {
    it("return a promise when provide no callback", function (done){
      nextTick().then(done);
    })

    it("return a content when provide no callback and an obj", function (done){
      let obj = {};
      nextTick(undefined, obj).then(function (ctx){
        expect(ctx).toBe(obj);
        done();
      })
    })

    it("returned promise should resolved correctly", function(done){
      let spy = jasmine.createSpy();
      nextTick(spy);
      nextTick().then(function(){
        expect(spy).toHaveBeenCalled();
        done();
      })
    })
  }
})