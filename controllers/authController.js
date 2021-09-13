const { validationResult } = require("express-validator");

const userService = require("../services/userService");

const authService = require("../services/authService");

module.exports.signup_get = (req, res) => {
  
  res.render("signup");
  res.status(200).send();
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = {};
    errors.array().forEach((err) => {
      validationErrors[err.param] = err.msg;
    });
    return res.status(400).send({
      validationErrors: validationErrors,
    });
  }

  const user = await userService.saveUser(req.body);

  const token = authService.createToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: authService.maxAge * 1000,
  });

  res.status(200).json(user);
};

module.exports.login_post = async (req, res) => {
  try {
    const user = await userService.login(req.body);
    const token = authService.createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: authService.maxAge * 1000,
    });
    res.status(200).json({user:user._id});

    // res.send('user login');
  } catch (err) {
    if (err.message == "incorrect email") {
      return res.status(400).send({
        validationErrors: { email: err.message },
      });
    } else if (err.message == "incorrect password") {
      return res.status(400).send({
        validationErrors: { password: err.message },
      });
    } else {
      return res.status(400).send({
        validationErrors: { errors: err.message },
      });
    }
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
};
