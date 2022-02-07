export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T;

const isProd = () => false

export function readonly<T extends Object>(val: T): Readonly<T> {
  // Fail only on development due to perf issues
  if (isProd()) {
    return val
  }
  return Object.freeze({ ...val })
}
