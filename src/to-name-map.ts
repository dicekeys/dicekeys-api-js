export const toNameMap = <TYPE extends string>(names: readonly TYPE[]) => names.reduce( (result, key) => {
  return Object.assign(result, {[key]: key} as Partial<{[key in TYPE]: key}>);
},
{} as Partial<{[key in TYPE]: key}>
) as {[key in TYPE]: key};

type KeysIncludingOptionalKeys<T> = T extends any ? keyof T : never;
export const toFieldNameMap = <
  OBJECT_TYPE
>(
  ...names: (KeysIncludingOptionalKeys<OBJECT_TYPE>)[]
) : {[key in (KeysIncludingOptionalKeys<OBJECT_TYPE>)]: key} =>
  names.reduce( (result, key) => {
      return Object.assign(result, {[key]: key} as Partial<{[key in (KeysIncludingOptionalKeys<OBJECT_TYPE>)]: key}>);
    },
    {} as Partial<{[key in (keyof OBJECT_TYPE)]: key}>
  ) as {readonly [key in (keyof OBJECT_TYPE)]: key};
