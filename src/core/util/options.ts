import { hasOwn } from "src/shared/util";
import { camelize, capitalize } from "src/shared/util";

export function resolveAsset(
  options: { [key: string]: any },
  type: string,
  id: string
): any {
  if (typeof id !== "string") {
    return;
  }

  const assets = options[type];
  if (hasOwn(assets, id)) return assets[id];
  const camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) return assets[camelizedId];
  const capitalizeId = capitalize(camelizedId);
  if (hasOwn(assets, capitalizeId)) return assets[capitalizeId];
}