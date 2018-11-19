import { no } from "src/shared/util";

export type Config = {
  isUnknownElement: (x?: string) => boolean | typeof no;
}

const config: Config = {
  isUnknownElement: no,
}

export default config;
