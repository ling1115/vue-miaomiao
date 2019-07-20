var mongoose = require("mongoose");
var { Head } = require("../untils/config.js")
var url = require("url")

// 让index生效： 唯一性
mongoose.set("useCreateIndex" , true);

// 表结构定义： 字段
var UserSchema = new mongoose.Schema({
    // 用户名：类型string,不为空,且唯一
    username : { type : String , required : true , index : { unique:true } },
    password : { type : String , required : true },
    email : { type : String , required : true , index : { unique:true } },
    isAdmin : { type : Boolean , default : false },
    date : { type : Date , default : Date.now() },
    isFreeze : { type : Boolean , default : false },
    userHead : { type : String , default : url.resolve(Head.baseUrl , "default.jpg") }

})
// 创建user模型
var UserModel = mongoose.model('user' , UserSchema);
// index唯一性生效
UserModel.createIndexes();

/* 方法：增删改查 */
/* 保存 */
var save = (data)=>{
	var user = new UserModel(data);
	return user.save()
		   .then(()=>{
		   		return true;
		   })
		   .catch(()=>{
		   		return false;
		   });
};
/* 验证登录 */
var findLogin = (data)=>{
	return UserModel.findOne(data);
}
/* 修改密码 */
var updatePassword = (email , password)=>{
    return UserModel.update( {email} , { $set : { password } })
            .then(()=>{
                return true;
            })
            .catch(()=>{
                return false;
            })
}

var usersList = ()=>{
    return UserModel.find()
}

var updateFreeze = (email , isFreeze)=>{
    return UserModel.update({email} , { $set: {isFreeze} })
            .then(()=>{
                return true
            })
            .catch(()=>{
                return false
            })
}

var deleteUser = (email)=>{
    return UserModel.deleteOne({email})
}

var updateUserHead = (username , userHead)=>{
    return UserModel.update( {username} , { $set: {userHead} } )
            .then(()=>{
                return true;
            })
            .catch(()=>{
                return false;
            })
}

module.exports = {
	save,
	findLogin,
    updatePassword,
    usersList,
    updateFreeze,
    deleteUser,
    updateUserHead
}