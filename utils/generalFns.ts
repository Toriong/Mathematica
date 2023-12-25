
const getType = (val: any) => typeof val;

type TDataType = ReturnType<typeof getType>;

export function getIsTValid<TData>(
    val: TData,
    expectedType: TDataType,
    isNotNullForObj = true
) {
    return (typeof val === expectedType) && isNotNullForObj
}