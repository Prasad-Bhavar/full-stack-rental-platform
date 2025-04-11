if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();
const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  // message: "Too many request Arrived, Please try Later",
  handler: (req, res) => {
    res.status(429).render("listing/ratelimit");
  },
});
const mongoose = require("mongoose");
const dburl = process.env.MONGO_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { required } = require("joi");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const { listingSchema, reviewSchema } = require("./schema.js");

const router = express.Router();
const listingRouter = require("./router/listing.js");
const reviewRouter = require("./router/review.js");
const userRouter = require("./router/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: "mysecretcode",
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in mongo session", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));

async function main() {
  await mongoose.connect(dburl);
}

main()
  .then((res) => console.log("connection establish with database succesfully"))
  .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//rate Limiting
app.use("/listing", limiter);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//listing router
app.use("/listing", listingRouter);
app.use("/listing", reviewRouter);
app.use("/", userRouter);
app.get("/", (req, res) => {
  res.render("./listing/home.ejs");
});
// app.get('/demouser',async(req,res)=>{
//     const fakeUser = new User({
//         email:'prasad04@gmail.com',
//         username:'met_student'
//     }) ;
//     const result = await User.register(fakeUser,'helloworld')  ;
//     res.send(result)
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

//middleware
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening");
});
