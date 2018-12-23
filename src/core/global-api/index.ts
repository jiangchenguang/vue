import vueInstance from '../../core/instance/index';
import { initMixin } from "./mixin";
import { initExtend } from "./extend";
import config from "../config";
import {
  nextTick
} from "src/core/util/index";
import { set, del } from "src/core/observer/index";
import { parse } from "src/compiler/parse/index";

export function initGlobalAPI(Vue: typeof vueInstance) {
  // config
  const configDef: PropertyDescriptor = {};
  configDef.get = () => config;
  configDef.set = () => {
    console.error('Do not replace Vue config object!');
  }
  Object.defineProperty(Vue, "config", configDef);

  Vue.nextTick = nextTick;
  Vue.set = set;
  Vue.delete = del;
  Vue.parse = parse;

  initMixin(Vue);
  initExtend(Vue);
}