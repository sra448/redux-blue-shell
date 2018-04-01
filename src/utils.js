import { map, type, mapObjIndexed } from "ramda";

export const collapseModelLeaves = (name, obj) => {
  if (obj[name] !== undefined) {
    return obj[name];
  } else {
    const recur = map(x => (x[name] !== undefined ? x[name] : recur(x)));
    return recur(obj);
  }
};

export const mapLeavesWithPath = (fn, obj, path = []) =>
  mapObjIndexed(
    (value, key) =>
      type(value) === "Object"
        ? mapLeavesWithPath(fn, value, [...path, key])
        : fn(value, [...path, key]),
    obj
  );
