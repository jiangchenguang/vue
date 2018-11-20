import { ComponentOptions } from "types/options";

export default class Vue {
  constructor(options?: ComponentOptions);

  readonly $options: ComponentOptions;
  readonly $el: Element;

  static config: {
    isUnknownElement: (str?: string) => boolean;
  }
}