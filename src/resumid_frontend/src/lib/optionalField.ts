type Nullable<T> = [] | [T]

type UnwrapNullable<T> = T extends Nullable<infer U>
  ? U | undefined
  : T

export type Flatten<T> =
  T extends Nullable<infer U>
    ? U | undefined
    : T extends (infer A)[]
      ? Flatten<A>[]
      : T extends object
        ? { [K in keyof T]: Flatten<T[K]> }
        : T


export const toNullable = <T>(value: T): [] | [T] => {
    return value ? [value] : []
}

export const fromNullable = <T>(value: [T] | []): T | undefined => {
    return value?.[0]
}

export const flattenNullable = <T>(data: T): any => {
  if (Array.isArray(data)) {
    // [] | [T] -> unwrap
    if (data.length <= 1) {
      return fromNullable(data as Nullable<any>)
    }
    // normal array (e.g. ["a","b"]) -> recurse into items
    return data.map((item) => flattenNullable(item))
  }

  if (data !== null && typeof data === "object") {
    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(data)) {
      result[key] = flattenNullable(value)
    }
    return result
  }

  return data
}