import Vue from "src/core/index";

function normalizeEvent(name: string): {
  name: string,
  capture: boolean
} {
  const capture: boolean = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;

  return {
    name,
    capture,
  }
}

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
  let event: { name: string; capture: boolean };
  for (name in on) {
    event = normalizeEvent(name);

    cur = on[name];
    old = oldOn[name];

    if (!cur) {
      console.warn(`invalid handler for event:${name}`);
    } else if (!old) {
      if (!cur.fns) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.capture);
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
