export interface GlobalAPI {
  nextTick: (cb?: Function, obj?: object) => void;

  set: (obj: any, key: string| number, val: any) => void,
  delete: (obj: any, key: string | number) => void,
}