export class ApiError extends Error {
    static instance: any;
    public status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;

        if (typeof ApiError.instance === "object") {
            return ApiError.instance
        }

        ApiError.instance = this
    }
}
