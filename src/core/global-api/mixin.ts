import Vue from '../instance/index';
import { mergeOptions } from "../util/options";

export function initMixin(vue: typeof Vue) {
  vue.mixin = function (option: any) {
    this.options = mergeOptions(this.options, option || {})
    return this;
  }
}