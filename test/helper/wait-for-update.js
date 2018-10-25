import Vue from "src/entries/web-runtime";

window.waitForUpdate = function (firstCB){
  let end;
  const queue = firstCB ? [ firstCB ] : [];

  function shift (){
    const job = queue.shift();
    if (queue.length){
      let hasError = false;
      try {
        job();
      } catch (e) {
        hasError = true;
        const done = queue[queue.length - 1];
        if (done && done.fail){
          done.fail(e);
        }
      }

      if (!hasError && queue.length) {
        Vue.nextTick(shift);
      }
    } else if (job && (job.fail || job === end)) {
      job();
    }
  }

  Vue.nextTick(function(){
    if (!queue.length || (!end && !queue[queue.length - 1].fail)) {
      throw new Error("waitForUpdate chain is missing .then(done)")
    }
    shift();
  })

  const chainer = {
    then: nextCB => {
      queue.push(nextCB);
      return chainer;
    },
    end: endCB => {
      queue.push(endCB);
      end = endCB;
    }
  }

  return chainer;
}