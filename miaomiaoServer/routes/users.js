var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users.js');

var multer = require("multer");
var upload = multer({ dest : "public/uploads/" }); // 指定上传路径

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/login", usersController.login );
router.post("/register", usersController.register );
router.get("/verify", usersController.verify );
router.get("/logout", usersController.logout );
router.get("/getUser", usersController.getUser );
router.post("/findPassword", usersController.findPassword );
router.get("/verifyImg" , usersController.verifyImg)

// 配置上传文件路由接口:指定上传类型为单个文件
router.post("/uploadUserHead" , upload.single("file") , usersController.uploadUserHead);


module.exports = router;
