import vueInstance from '../../core/instance/index';
import { initAsset } from "./asset";
import { initExtend } from "./extend";
import { initMixin } from "./mixin";
import config from "../config";
import {
  nextTick
} from "src/core/util/index";
import { set, del } from "src/core/observer/index";
import { parse } from "src/compiler/parse/index";
import { ASSET_LIST, assetList } from "src/shared/constant";

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

  Vue.options = Object.create(null);
  ASSET_LIST.forEach(type => {
    Vue.options[type + 's'] = Object.create(null);
  })
  Vue.options._base = Vue;

  initMixin(Vue);
  initExtend(Vue);
}