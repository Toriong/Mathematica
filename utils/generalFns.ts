
const getType = (val: any) => typeof val;

export type TDataTypes = ReturnType<typeof getType>;

export function getIsTValid<TData>(
    val: TData,
    expectedType: TDataTypes,
    isNotNullForObj = true
) {
    return (typeof val === expectedType) && isNotNullForObj
}