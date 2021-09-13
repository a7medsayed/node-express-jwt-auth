const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "dont try", (err, decodedtoken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "dont try", async (err, decodedtoken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {

        const user = await User.findById(decodedtoken.id);
       res.locals.user = user;

        next();
        
      }
    });
  } else {
    res.locals.user = null;
    next()
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "dont try", async (err, decodedtoken) => {
      if (err) {
        res.locals.user = null;
        
      } else {

        const user = await User.findById(decodedtoken.id);
       res.locals.user = user;

       if(user.role == 'admin'){
        next();
       }
       else
       {
         res.status(403).send('Forbidden! You do not have authorized roles to do this action');
       }
      }
    });
  } else {
    res.locals.user = null;
    
  }
};
module.exports = { requireAuth , checkUser , isAdmin};
