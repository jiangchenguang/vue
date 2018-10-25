import { queueWatcher as _queueWatcher } from "src/core/observer/scheduler";

function queueWatcher (obj){
  _queueWatcher(obj);
}

describe("scheduler", function (){
  let spy;
  beforeEach(function (){
    spy = jasmine.createSpy("scheduler");
  })

  it("queueWatcher", function (done){
    queueWatcher({
      run: spy
    })

    waitForUpdate(function (){
      expect(spy.calls.count()).toBe(1)
    }).end(done);
  })

  it("same watcher should only run once", function (done){
    queueWatcher({
      id : 1,
      run: spy
    });
    queueWatcher({
      id : 1,
      run: spy
    });

    waitForUpdate(function (){
      expect(spy.calls.count()).toBe(1)
    }).end(done);
  })

  it("allow duplicate when flushing", function (done){
    const job = {
      id : 1,
      run: spy
    }
    queueWatcher(job);
    queueWatcher({
      id : 2,
      run: () => {queueWatcher(job)}
    })

    waitForUpdate(function (){
      expect(spy.calls.count()).toBe(2)
    }).end(done)
  })

  xit("call user watchers before component re-render", function(){

  })

  xit("call user watcher triggled by component re-render immediately", function(){

  })

  xit("warn against infinite update loop", function (){
  })

  it("should call newly pushed watcher after current watcher is done", function(done){
    const callOrder = [];
    queueWatcher({
      id: 1,
      run: function(){
        callOrder.push(1);
        queueWatcher({
          id: 2,
          run: function(){
            callOrder.push(3);
          }
        })
        callOrder.push(2);
      }
    })

    waitForUpdate(function(){
      expect(callOrder).toEqual([1, 2, 3]);
    }).end(done)
  })
})
