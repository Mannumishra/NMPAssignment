const { createSignUp, loginUser, getUserbyUserID, logoutUser, getAllUsers, deleteUserbyUserID, updateUserbyUserID, googleChekc } = require("../Controllers/User.Controller")
const { protectUser, verifyBoth, protectAdmin } = require("../Middlewares/Authorization")
const passport = require('passport');
const UserRouter = require("express").Router()

require("../passportConfig")

UserRouter.post("/sign-up", createSignUp)
UserRouter.get("/get-user-by-userid/:id", verifyBoth, getUserbyUserID)
UserRouter.get("/get-users", protectAdmin, getAllUsers)
UserRouter.put("/update-user/:id", protectAdmin, updateUserbyUserID)
UserRouter.delete("/delete-user-record/:id", protectAdmin, deleteUserbyUserID)

UserRouter.post("/log-in", loginUser)
UserRouter.post("/log-out", logoutUser)

UserRouter.post("/auth/google", googleChekc)


UserRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

UserRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/log-in' }),
    (req, res) => {
        res.redirect('/');
    }
);

module.exports = UserRouter