import { initMixin } from "./init";
import { stateMixin } from "./state";
import { lifeCycleMixin } from "./lifeCycle";
import { renderMixin } from "./render";
import { ComponentOptions } from "types/options";
import { Component } from "types/component";

function VueConstructor(options?: ComponentOptions) {
  this._init(options);
}

initMixin(VueConstructor);
stateMixin(VueConstructor);
lifeCycleMixin(VueConstructor);
renderMixin(VueConstructor);

export default VueConstructor;

