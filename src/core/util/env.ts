export function isNative(Fn: Function): boolean {
  return Fn.toString().indexOf("[native code]") > -1;
}

export const hasPromise = isNative(Promise);

export const nextTick: (cd?: Function, obj?: object) => void = (function () {
  const callBacks = Array();
  let pending = false;

  function nextTickHandler() {
    pending = false;
    const copies = callBacks.slice();
    callBacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  let timerHandler: Function;
  if (hasPromise) {
    let promise = Promise.resolve();
    timerHandler = () => {
      promise.then(() => {
        nextTickHandler()
      })
    }
  } else {
    timerHandler = () => {
      setTimeout(nextTickHandler, 0);
    }
  }

  return function queueNextTick(cb?: Function, obj?: object) {
    let _resolve: Function;
    callBacks.push(() => {
      if (cb) {
        cb.call(obj);
      } else if (_resolve) {
        _resolve(obj)
      }
    })
    if (!pending) {
      pending = true;
      timerHandler();
    }

    if (!cb && hasPromise) {
      return new Promise((resolve, reject) => {
        _resolve = resolve;
      })
    }
  }
})();
