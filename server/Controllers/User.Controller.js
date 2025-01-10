const User = require("../Model/UserModel")
const passwordValidator = require('password-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require('google-auth-library');

const schema = new passwordValidator();

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123'])

const createSignUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!firstName || !email || !password) {
            return res.status(400).json({ error: "First name, email, and password are required." });
        }

        if (!schema.validate(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long, include uppercase and lowercase letters, a digit, a special character, and must not contain spaces."
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const SALTROUND = parseInt(process.env.SALT_ROUND)
        const hashedPassword = await bcrypt.hash(password, SALTROUND);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "User"
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while creating the user." });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "User" });
        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No User Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User Record Found Successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUserbyUserID = async (req, res) => {
    try {
        console.log(req.params.id)
        const data = await User.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "UserFound Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteUserbyUserID = async (req, res) => {
    try {
        console.log("Run function ", req.params.id)
        const data = await User.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        await data.deleteOne()
        return res.status(200).json({
            success: true,
            message: "User Record Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        let secretKey;
        if (user.role === 'Admin') {
            secretKey = process.env.JWT_SECRET_ADMIN;
        } else {
            secretKey = process.env.JWT_SECRET_USER;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            secretKey,
            { expiresIn: "1h" }
        );


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.status(200).json({ message: "Login successful", user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong during login." });
    }
};

const updateUserbyUserID = async (req, res) => {
    try {
        console.log(req.params.id)
        const data = await User.findById(req.params.id)
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        data.firstName = req.body.firstName || data.firstName
        data.lastName = req.body.lastName || data.lastName
        data.email = req.body.email || data.email
        data.role = req.body.role || data.role

        await data.save()
        return res.status(200).json({
            success: true,
            message: "User Update Successfully Successfully",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });
    }
}


const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong during logout." });
    }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleChekc = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, given_name, family_name } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                firstName: given_name,
                lastName: family_name || '',
                email,
                password: null,
            });
            await user.save();
        }

        res.status(200).json({ message: 'Login Successful', user });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
}

module.exports = { googleChekc, createSignUp, loginUser, logoutUser, getUserbyUserID, getAllUsers, deleteUserbyUserID, updateUserbyUserID };