var mongoose = require("mongoose");
var nodemailer = require("nodemailer");
// url: '协议://ip:端口/数据库'
var Mongoose = {
    url : "mongodb://localhost:27017/miaomiao",
    connect(){
        mongoose.connect( this.url , (err)=>{
            if( err ){
                console.log( "数据库连接失败" );
                return ;
            }
            console.log( "数据库连接成功" );
        });
    }
}

var Email = {
    config : {
        host: "smtp.qq.com", // 指定的邮箱
        port: 587,
        auth: {
            user: "lufeibaozang@qq.com", // 发件人邮箱
            pass: "voebhsywemxzgbga" // 秘钥
        }
    }, 
    get transporter(){
        return nodemailer.createTransport( this.config );
    },
    get verify(){
        return Math.random().toString().substring(2,6); // 4位验证码
    },
    get time(){
		return Date.now();
	}
}

var Head = {
    baseUrl : "http://localhost:3000/uploads/"
}

module.exports = {
    Mongoose,
    Email,
    Head
}