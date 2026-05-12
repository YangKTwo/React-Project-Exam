export interface PageParams {
    current?: number
    size?: number
    keyword?: string
    type?: string
    difficulty?: string
    [key: string]: unknown
}

export interface PageResult<T> {
    records: T[]
    total: number
    size: number
    current: number
    pages: number
}