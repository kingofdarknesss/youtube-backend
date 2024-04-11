import { Router } from "express";
import {
  registeruser,
  loginuser,
  logoutuser,
  refreshAccessToken,
  getCurrentuser,
  changeCurrentPassword,
  updateAccountDetails,
  updateuserAvatar,
  updateuserCoverImage,
  getuserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registeruser
);

router.route("/login").post(loginuser);

//secured routes
router.route("/logout").post(verifyJWT, logoutuser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentuser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateuserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateuserCoverImage);

router.route("/c/:username").get(verifyJWT, getuserChannelProfile);
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
