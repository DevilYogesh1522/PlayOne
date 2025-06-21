import { Router } from "express";
import { loginuser, registeruser,logoutuser } from "../controllers/user.controller.js";  // ✅ named import
import { upload } from "../middleware/multer.middleware.js";
import { varifyjwt } from "../middleware/auth.middleware.js";
const router = Router();

router.route('/register').post(
     upload.fields([
        { 
            name:"avatar",
            maxCount:1
        },
        { 
            name:"coverImage",
            maxCount:1
        }
     ]),
    registeruser);
router.route('/login').post(loginuser)
//secured routs
router.route('/logoutuser').post(varifyjwt,logoutuser)
export default router;