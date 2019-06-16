class HttpException extends Error {
    constructor(msg='服务器异常', errorCode=10000, code=400) {
        super();
        this.errorCode = errorCode;
        this.code = code;
        this.msg = msg;
    }
}

class ParameterException extends HttpException {
    constructor(msg='参数错误', errorCode=10000) {
        super(msg, errorCode, 404);
    }
}

module.exports = {
    HttpException,
    ParameterException
};