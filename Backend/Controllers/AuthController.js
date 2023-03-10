import User from "../Models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateUsername = async (username) => {
  const user = await User.findOne({ username });
  return user ? false : true;
};

const validateNumber = async (number) => {
  const user = await User.findOne({ number });
  return user ? false : true;
};

export const signup = async (req, res, next) => {
  try {
    const usernameNotTaken = await validateUsername(req.body.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: "username is already taken",
        success: false,
      });
    }
    const numberNotTaken = await validateNumber(req.body.number);
    if (!numberNotTaken) {
      return res.status(400).json({
        message: "Phone Number already taken",
        success: false,
      });
    }

    const newdata = {
      username: req.body.username,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      address: req.body.address,
      city: req.body.city,
      routepoints: req.body.routepoints,
      collage: req.body.collage,
      number: req.body.number,
      profilePicture: req.file.filename,
    };

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...newdata, password: hash });
    await newUser.save();
    res.status(200).send("user has been created please Login");
  } catch (error) {
    next(error);
  }
};

// login user
export const signin = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({
        message: "please Enter Username & password",
        success: false,
      });
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return res.status(401).json({
        message: "Invalid Username or password",
        success: false,
      });
    }
    const mainuser = await User.findOneAndUpdate(
      username,
      {
        status: "online",
      },
      { new: true }
    );
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT
    );

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 10 * 60 * 60 * 1000,
      })
      .status(200)
      .json(mainuser);
  } catch (error) {
    next(error);
  }
};
