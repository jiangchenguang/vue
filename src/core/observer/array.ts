import { def } from "src/core/util/index";
import { Observer } from "../observer/index";

let arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

[
  "push",
  "pop",
  "splice",
  "shift",
  "unshift",
  "sort",
  "reverse"
].forEach(function (method) {
  let originFn = arrayMethods[method];

  def(arrayMethods, method, function mutator() {
    let args = Array.from(arguments);
    let result = originFn.apply(this, args);

    let insert;
    switch (method) {
      case "push":
        insert = args;
        break;
      case "unshift":
        insert = args;
        break;
      case "splice":
        insert = args.slice(2);
        break;
    }
    insert && Observer.observeArray(insert);

    let ob: Observer = this.__ob__;
    ob.dep.notify();

    return result;
  });
});

