import Vue from "src/core/index";

function createFnInvoker(fns: Function | Function[]): Function {
  function invoker() {
    const fns = invoker.fns;
    if (Array.isArray(fns)) {
      for (let fn of fns) {
        fn.apply(null, arguments);
      }
    } else {
      fns.apply(null, arguments);
    }
  }

  invoker.fns = fns;
  return invoker;
}

export function updateListeners(
  on: { [key: string]: any },
  oldOn: { [key: string]: any },
  add: Function,
  remove: Function,
  vm: Vue
) {
  let name: string;
  let cur: any;
  let old: any;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];

    if (!cur) {
      console.warn(`invalid handler for event:${name}`);
    } else if (!old) {
      if (!cur.fns) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(name, cur);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }

  for (name in oldOn) {
    if (!on[name]) {
      remove(name, oldOn[name]);
    }
  }
}