import { Router } from "express";
import {
  changeCurrentPassword,
  deleteUserById,
  getAllUsers,
  getCurrentUser,
  getUserById,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserDetails,
  deleteManyAgents,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import blockGuestUser from "../middlewares/blockGuestUsers.middleware.js";

const router = Router();

router
  .route("/register")
  .post(verifyJWT, upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secured
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/").get(verifyJWT, getAllUsers);
router.route("/:id").get(verifyJWT, blockGuestUser, getUserById);
router.route("/refresh-token").post(blockGuestUser, refreshAccessToken);
router
  .route("/change-password")
  .patch(verifyJWT, blockGuestUser, changeCurrentPassword);
router.route("/update-profile").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-user/:id")
  .patch(verifyJWT, blockGuestUser, updateUserDetails);
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);
router
  .route("/delete-user/:id")
  .delete(verifyJWT, blockGuestUser, deleteUserById);
router.route("/delete-many").post(verifyJWT, blockGuestUser, deleteManyAgents);

export default router;
