import vueInstance from "../instance/index";
import { ASSET_LIST, assetList } from "src/shared/constant";
import { isPlainObject } from "src/shared/util";

export function initAsset(Vue: typeof vueInstance) {
  ASSET_LIST.forEach((type: assetList) => {
    Vue[type] = function (
      id: string,
      defination: { [key: string]: any }
    ) {
      if (!defination) {
        return this.options[type + 's'][id];
      } else {
        if (type === 'component' && isPlainObject(defination)) {
          defination.name = defination.name || id;
          defination = Vue.options._base.extend(defination);
          this.options[type + 's'][id] = defination;
        }
        return defination;
      }
    }
  })
}