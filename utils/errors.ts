
export interface ICustomError {
    msg: string,
    status: number
}

export class CustomError {
    msg = ""
    status: number | null = null
    constructor(msg: string, status: number) {
        this.msg = msg;
        this.status = status
    }
}