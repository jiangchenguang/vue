import Vue from 'src/core/instance/index';
import { mergeOptions } from "../util/options";

type vueInstance = Vue;
type vueConstructor = typeof Vue;

Vue.cid = 0;
let cid = 1;

export function initExtend(Vue: vueConstructor) {
  Vue.extend = function (extendOption: { [key: string]: any }): vueConstructor {
    const _super: vueConstructor = this;
    let cachedCtor = extendOption._ctor || (extendOption._ctor = {});
    if (cachedCtor[_super.cid]) {
      return cachedCtor[_super.cid];
    }

    class Sub extends _super {
      constructor(options?: object) {
        super(options);
      }
    }

    Sub.cid = cid++;
    Sub.super = this;
    Sub.options = mergeOptions(
      _super.options,
      extendOption,
    );
    Sub.extend = _super.extend;

    Sub.superOpt = _super.options;
    Sub.extendOpt = extendOption;
    cachedCtor[_super.cid] = Sub;
    return Sub;
  }
}