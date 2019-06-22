module.exports = {
    environment: 'dev',
    database: {
        dbName: 'island_xcm',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'xcm2emo'
    },
    security: {
        secretKey: "abcde",
        expiresIn: 60*60*24*30 // 过期时间
    },
    wx: {
        appId: 'wxa1d9305f8212dc32',
        appSecret: '3e0e0730fb75b35395d6805f57e6c7b0',
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code'
    }
}