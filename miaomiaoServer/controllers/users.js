var { Email , Head } = require("../untils/config.js");
var UserModel = require("../models/users.js");
var { setCrypto , createVerify } = require("../untils/base")
var fs = require("fs");
var url = require('url');

var login = async (req,res,next)=>{
    var { username , password , verifyImg} = req.body;

    /* 图形验证 */
    if( verifyImg !== req.session.verifyImg ){
        res.send({
            msg : "验证码输入错误",
            status : -3
        })
        return ;
    }
    /* 数据库中验证 */
    var result = await UserModel.findLogin({
        username,
        password:setCrypto(password)
    })
    /* 
    *   在这里只是简单的验证，没有实现防止CSRF攻击
    *   还需要在前端做一个验证机制：验证码
    *   在后面再继续优化
    */
    if(result){
        /* 
        * 用户进入个人页时判断是否已登录
        * 需要存储用户登录状态，可以使用本地存储或者token
        * 这里使用session存储，网易严选采用的token
        * 然后将用户信息展示在个人中心页
        */
        req.session.username = username;
        req.session.isAdmin = result.isAdmin;
        req.session.userHead = result.userHead;

        if( result.isFreeze ){
            res.send({
                msg : "账户已冻结",
                status : -2
            })
        }else{
            res.send({
                msg : "登录成功",
                status : 0
            })
        }
        
    }else{
        res.send({
            msg : "登录失败",
            status : -1
        })
    }
};

var register = async (req,res,next)=>{
    // register是通过post请求的，所以信息在body中获取
    var { username , password , email , verify } = req.body;
    // 判断验证码或邮箱是否匹配
    if( email !== req.session.email || verify !== req.session.verify ){
        res.send({
            msg : "验证码错误",
            status : -1
        })
        return;
    }
    /* 验证码时效：1分钟 */
    if( (Email.time - req.session.time)/1000 > 60 ){
		res.send({
			msg : '验证码已过期',
			status : -3
		});
		return;
	}

    var result = await UserModel.save({
        username,
        password: setCrypto(password),
        email
    })
    // 判断：save返回的结果
    if( result ){
        res.send({
            msg : "注册成功",
            status : 0
        })
    }else{
        res.send({
            msg : "注册失败",
            status : -2
        })
    }
};

var verify = async (req,res,next)=>{
    var email = req.query.email;
	var verify = Email.verify;

    /* 
    * 将验证码和邮箱保存在session中
    * 注册的邮箱和验证码是匹配的关系
    */
	req.session.verify = verify;
    req.session.email = email;
	req.session.time = Email.time;
    // 配置：要发送的一些字段等，官网
    var mailOptions = {
        from: '喵喵网 👻 lufeibaozang@qq.com', // sender address
        to: email, // list of receivers
        subject: "Hello ✔ ,喵喵网邮箱验证码", // Subject line
        text: "验证码："+ verify // plain text body
    }

    Email.transporter.sendMail(mailOptions , (err)=>{
        // 判断：存在info,则返回前端：验证码发送成功，status:0表示成功
        if( err ){
            res.send({
                "msg" : "验证码发送失败",
                status : -1
            });
        }else{
            res.send({
                "msg" : "验证码发送成功",
                status : 0
            });
        }
    })
};

var logout = async (req,res,next)=>{
    req.session.username = '';
    res.send({
        msg : "退出成功",
        status : 0
    })
};

var getUser = async (req,res,next)=>{
    if( req.session.username ){
        res.send({
            msg : "获取用户信息成功",
            status : 0,
            data : {
                username : req.session.username,
                isAdmin : req.session.isAdmin,
                userHead : req.session.userHead
            }
        })
    }else{
        res.send({
            msg : "获取用户信息失败",
            status : -1
        })
    }
};

var findPassword = async (req,res,next)=>{
    var { email , password , verify } = req.body;

    if( email === req.session.email && verify === req.session.verify ){
        var result = await UserModel.updatePassword( email , setCrypto(password) );

        if( result ){
            res.send({
                msg : "修改密码成功",
                status : 0
            })
        }else{
            res.send({
                msg : "修改密码失败",
                status : -1
            })
        }
    }else {
        res.send({
            msg : "验证码失败",
            status : -1
        })
    }
};

var verifyImg = async (req,res,next)=>{
	var result = await createVerify(req,res);
	if(result){
		res.send(result);
	}
}

var uploadUserHead = async (req,res,next)=>{
	
	console.log( req.file );

	await fs.rename( 'public/uploads/' + req.file.filename , 'public/uploads/' + req.session.username + '.jpg',function(err){
        if(err){
            throw err;
        }else{
            console.log("上传头像done!")
        }
    } );

	var result = await UserModel.updateUserHead( req.session.username , url.resolve(Head.baseUrl , req.session.username + '.jpg' ) );
	
	if(result){
		res.send({
			msg : '头像修改成功',
			status : 0,
			data : {
				userHead : url.resolve(Head.baseUrl , req.session.username + '.jpg' )
			}
		});
	}
	else{
		res.send({
			msg : '头像修改失败',
			status : -1
		});
	}

}


module.exports = {
    login,
    register,
    verify,
    logout,
    getUser,
    findPassword,
    verifyImg,
    uploadUserHead
}