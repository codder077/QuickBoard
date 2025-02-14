const Users = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("Received registration request");
    const { fullname, phone, email, password } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res
        .status(400)
        .json({ message: "Please fill all required details", status: 400 });
    }

    const isAlreadyExist = await Users.findOne({ email });
    const isUserAlreadyExist = await Users.findOne({ phone });

    if (isAlreadyExist || isUserAlreadyExist) {
      return res
        .status(400)
        .json({ message: "User Already Exists", status: 400 });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedpassword = await bcryptjs.hash(password, salt);

    const newUser = new Users({
      fullName: fullname,
      email,
      password: hashedpassword,
      phone,
    });

    await newUser.save();
    return res
      .status(200)
      .json({ message: "User Registered Successfully", status: 200 });
  } catch (error) {
    console.log(error, "signup backend error");
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the required details", status: 400 });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User Email or Password is Incorrect", status: 400 });
    }

    const validateUser = await bcryptjs.compare(password, user.password);
    if (!validateUser) {
      return res
        .status(400)
        .json({ message: "User Email or Password is Incorrect", status: 400 });
    }

    const payload = {
      userId: user._id,
      email: user.email,
    };
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "quickboard";

    jwt.sign(
      payload,
      JWT_SECRET_KEY,
      { expiresIn: 84600 },
      async (err, token) => {
        await Users.updateOne(
          { _id: user._id },
          {
            $set: { token },
          }
        );
        user.save();
        return res.status(200).json({
          user: { id: user._id, email: user.email, fullName: user.fullName },
          token: token,
          message: "user signed in successfully",
          status: 200,
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", status: 500 });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
