const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const cookieParser = require('cookie-parser');
const { connectDB } = require("./Database/ConnectDB")
const cors = require("cors")
const UserRouter = require("./Routes/User.Routes")
const session = require('express-session');
const passport = require('passport');

const app = express()


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());

app.use(session({
    secret: "poiuytrewqtyuiooiuyrewrtyuioyaghjkkjhgfdsdfghjkhgfdrtyuiusdfghjkkjhgfdssdfg",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1", UserRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${process.env.PORT}`)
})


connectDB()