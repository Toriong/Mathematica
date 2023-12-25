export type TStatusesNumber = 200 | 404 | 500
export type TStatusesStr = "200" | "404" | "500"

export interface IResponse<TData> {
    data?: TData
    status: TStatusesNumber | TStatusesStr
}

export interface IError<TData> {
    response: IResponse<TData>
    status: Omit<TStatusesNumber, 200> | Omit<TStatusesStr, "200">
}