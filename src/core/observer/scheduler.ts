import Watcher from "./watcher";
import {
  nextTick
} from "src/core/util/index";

let queue: Watcher[] = [];
let has: { [index: number]: boolean } = {};
let flushing = false;
let waiting = false;
let index = 0;

function resetQueue() {
  queue.length = 0;
  has = {};
  flushing = waiting = false;
  index = 0;
}

function flushQueue() {
  flushing = true;

  queue.sort((a, b) => a.id - b.id);

  for (index = 0; index < queue.length; index++) {
    let watcher = queue[index];
    has[watcher.id] = false;
    watcher.run();
  }

  resetQueue();
}

export function queueWatcher(watcher: Watcher) {
  let id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      let i = queue.length - 1;
      while (i >= 0 && queue[i].id > id) {
        i--;
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher);
    }

    if (!waiting) {
      waiting = true;
      nextTick(flushQueue);
    }

  }
}