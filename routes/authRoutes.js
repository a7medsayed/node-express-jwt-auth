const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();
const { check, validationResult } = require("express-validator");

router.get("/signup", authController.signup_get);
router.post(
  "/signup",
  check("email")
    .notEmpty()
    .withMessage("email cannot be null")
    .bail()
    .isEmail()
    .withMessage("email is not valid"),
  check("password")
    .notEmpty()
    .withMessage("password cannot be null")
    .bail()
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 character"),

  authController.signup_post
);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

module.exports = router;
