import { makeMap } from "src/shared/util";

const acceptValue = makeMap("input,textare,option,select");
export function mustUseProp(tag: string, attr: string, type?: string): boolean{
  return (
    (attr === "value" && acceptValue(tag)) && type !== "button"
  )
}