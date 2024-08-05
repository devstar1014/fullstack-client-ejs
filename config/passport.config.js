const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const UsersDAL = require("../services/PG/p.Users.dal.js");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await UsersDAL.getUserByEmail(email);
      if (user === undefined || user === null) {
        return done(null, false, { message: "Invalid email or password." });
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid email of password." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (userId, done) => {
  const user = await UsersDAL.getUserById(userId);
  done(null, user);
});

const checkAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
};

const checkNotAuthenticated = (request, response, next) => {
  if (request.isAuthenticated()) {
    return response.redirect("/");
  }
  next();
};

module.exports = { checkAuthenticated, checkNotAuthenticated };
