var express = require("express");
var adminController = require("../controllers/admin");
var router = express.Router();

/* 预先拦截 */
router.use((req, res, next)=>{
    if( req.session.username && req.session.isAdmin ){
        next();
    }else{
        res.send({
            msg : "没有管理权限",
            status : -1
        })
    }
})

router.get("/" , adminController.index);
router.get("/usersList" , adminController.usersList);
router.post("/updateFreeze" , adminController.updateFreeze);
router.post("/deleteUser" , adminController.deleteUser);

module.exports = router