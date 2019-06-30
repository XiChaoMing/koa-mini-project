const LoginType = {
    // 小程序
    USER_MINI_PROGRAM: 100,
    // emial
    USER_EMAIL: 101,
    // 手机号
    USER_MOBILE: 102,
    // 管理员
    ADMIN_EMAIL: 200,
    isThisType
}

const ArtType = {
    MOVIE: 100,
    MUSIC: 200,
    SENTENCE: 300,
    BOOK: 400,
    isThisType
}

function isThisType(val) {
    for(let key in this) {
        if(this[key] == val) return true;
    }
    return false;
}

module.exports = {LoginType, ArtType};