const express  = require("express");
const router = express.Router();

const userController = require('../controllers/userController');
const customerController =require('../controllers/customerController');
const customerMessageController = require('../controllers/customerMessageController');




const {auth, isSuperAdmin, isAdmin}  = require('../middlewares/Auth');

const { imageSingleUpload } = require("../middlewares/multer");
// Home 
router.get("/", (req, res) =>{
    res.send("Welcome to Beauty Club Backend");
});

//Admin Route//
router.post("/create-user", auth, isSuperAdmin, userController.createAdmin);
router.post("/login-user", userController.login);
router.put("/update-user/:id",auth, isSuperAdmin,userController.updateUser);
router.put("/update-user-status", auth, isSuperAdmin, userController.updateUserStatus);
router.get("/get-all-users", auth, isSuperAdmin, userController.getUser);
router.get("/get-user-by-id/:id", auth, isSuperAdmin, userController.getUserById);
router.delete("/delete-user/:id", auth, isSuperAdmin, userController.deleteUser);
router.post("/change-password/:id", auth, isSuperAdmin, userController.updatePassword);

//customer route//
router.post("/submit-form", customerController.submitDetails);
router.get("/get-customer", auth, customerController.getDetails);


//message route//
router.post("/store-message", customerMessageController.storeMessage);
router.get("/get-all-message", auth, customerMessageController.getAllMessages);
router.get("/get-message-by-customer/:mobile/:cardNo", auth, customerMessageController.getMessageByCustomer);
router.put("/read-message/:id", auth, customerMessageController.readMessage);

module.exports = router;