export function def(obj: object, key: string, val: any, enumerable?: Boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

let RE = /[^\w.$]/;
export function parsePath(path: string): Function{
  if (RE.test(path)) {
    return;
  } else {
      let segments = path.split(".");
    return function(obj: any): any {
      for (let i = 0; i < segments.length; i++ ){
        if (!obj) return;
        obj = obj[segments[i]];
      }
      return obj;
    }
  }
}