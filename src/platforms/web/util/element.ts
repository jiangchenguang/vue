import { makeMap } from "src/shared/util";

export const isSVG = makeMap(
  `svg,`
)

export function getTagNamespace(tag: string): string | undefined {
  if (isSVG[tag]) {
    return "svg";
  }

}