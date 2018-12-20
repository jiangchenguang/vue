import Vue from "src/entries/web-runtime-with-compiler";

describe("instance init", function (){
  it('with new', function (){
    expect(new Vue() instanceof Vue).toBe(true);
  })
})
