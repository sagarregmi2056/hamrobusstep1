class ErrorResponse extends Error{
    constructor(message,codestatus){
        super(message);
        this.codestatus= codestatus;
    }
}
module.exports = ErrorResponse;