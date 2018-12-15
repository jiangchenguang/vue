import Vue from "src/entries/web-runtime-with-compiler";

describe("instance init", function (){
  it('with new', function (){
    expect(new Vue() instanceof Vue).toBe(true);
  })

  it('without new', function (){
    try {
      Vue();
    } catch (e) {
    }
    expect("Vue is a constructor and must be call with 'new' keyword").toHaveBeenWarned();
  })
})
