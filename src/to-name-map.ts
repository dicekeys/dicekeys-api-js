export const toNameMap = <TYPE extends string>(names: TYPE[]) => names.reduce( (result, key) => {
  return Object.assign(result, {[key]: key} as Partial<{[key in TYPE]: key}>);
},
{} as Partial<{[key in TYPE]: key}>
) as {[key in TYPE]: key};

export const toFieldNameMap = <
  OBJECT_TYPE
>(
  ...names: (keyof OBJECT_TYPE)[]
) : {[key in (keyof OBJECT_TYPE)]: key} =>
  names.reduce( (result, key) => {
      return Object.assign(result, {[key]: key} as Partial<{[key in (keyof OBJECT_TYPE)]: key}>);
    },
    {} as Partial<{[key in (keyof OBJECT_TYPE)]: key}>
  ) as {[key in (keyof OBJECT_TYPE)]: key};
