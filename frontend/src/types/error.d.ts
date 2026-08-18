export type ErrorCode =
    | "BAD_REQUEST"
    | "RESOURCE_NOT_FOUND"
    | "VALIDATION_ERROR"
    | "INTERNAL_ERROR"

export interface ErrorDetail {
    field: string
    message: string
}

export interface Error {
    code: ErrorCode
    message: string
    details: ErrorDetail[]
}