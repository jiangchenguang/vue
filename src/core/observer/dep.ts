import Watcher from "./watcher";
import { remove } from "src/shared/util";

let uid: number = 0;
let targetStack: Array<Watcher> = [];

export default class Dep {
  static target?: Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    for (let sub of this.subs) {
      sub.update();
    }
  }
}

export function pushTarget(_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}

