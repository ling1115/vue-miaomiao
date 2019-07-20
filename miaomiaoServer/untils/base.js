var crypto = require("crypto");
var captcha = require('trek-captcha');

var setCrypto = (info)=>{
    return crypto.createHmac("sha256", "##$#%##$%jdia")
            .update(info)
            .digest("hax")
}

var createVerify = (req,res)=>{
    /* 将返回的信息保存在session中 */
	return captcha().then((info)=>{
		req.session.verifyImg = info.token;
		return info.buffer;
	}).catch(()=>{
		return false;
	});
}

module.exports = {
    setCrypto,
    createVerify
}