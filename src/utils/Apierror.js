class APIError extends Error {
    constructor(
        statuscode,
        message="Something went Wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statuscode=statuscode,
        this.data=null,
        this.errors=errors
        this.message=message
        this.success=false

    }
}
export {APIError}