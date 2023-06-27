const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const { authLineToken, authLineRevoke } = require("../helpers/notify");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authCtrl = {
  signin: async (req, res) => {
    const { tokenId } = req.body;
    client
      .verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      .then((response) => {
        const { email, email_verified, picture, name } = response.payload;

        // const emailRegex = /^(\d{10})@psu\.ac\.th$/;
        // if (!emailRegex.test(email)) {
        //   return res.status(400).json({
        //     error: 'Invalid email format.',
        //   });
        // }
        if (email_verified) {
          Users.findOne({ email })
            .then(async (user) => {
              if (user) {
                const token = jwt.sign(
                  { _id: user._id },
                  process.env.JWT_SIGNIN_KEY,
                  { expiresIn: "7d" }
                );
                const { _id, name, email, username, avatar, role, lineToken } =
                  user;
                res.cookie("tokenId", tokenId, {
                  path: "/api/google-token",
                  httpOnly: false,
                  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                  secure: true,
                  sameSite: "none",
                });
                res.json({
                  token,
                  user: {
                    _id,
                    name,
                    email,
                    username,
                    avatar,
                    role,
                    lineToken,
                  },
                });
              } else {
                let password = email + process.env.JWT_SIGNIN_KEY;
                const username = email.split("@")[0];
                let newUser = new Users({
                  email,
                  avatar: picture,
                  name,
                  username,
                  password,
                });
                newUser
                  .save()
                  .then(async (data) => {
                    const token = jwt.sign(
                      { _id: data._id },
                      process.env.JWT_SIGNIN_KEY,
                      { expiresIn: "7d" }
                    );

                    const {
                      _id,
                      name,
                      email,
                      username,
                      avatar,
                      role,
                      lineToken,
                    } = newUser;
                    res.cookie("tokenId", tokenId, {
                      path: "/api/google-token",
                      httpOnly: false,
                      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                      secure: true,
                      sameSite: "none",
                    });
                    res.json({
                      token,
                      user: {
                        _id,
                        name,
                        email,
                        username,
                        avatar,
                        role,
                        lineToken,
                      },
                    });
                  })
                  .catch((err) => {
                    return res.status(400).json({
                      error: "Something went wrong",
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(400).json({
                error: "Something went wrong",
              });
            });
        }
      })
      .catch((err) => {
        return res.status(500).json({ msg: err.message });
      });
  },
  verify_token: async (req, res) => {
    const { tokenId } = req.cookies;
    client
      .verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      .then((response) => {
        const { email, email_verified, picture, name } = response.payload;
        // throw new Error('Parameter is not a number!');
        // const emailRegex = /^(\d{10})@psu\.ac\.th$/;
        // if (!emailRegex.test(email)) {
        //   return res.status(400).json({
        //     error: 'Invalid email format.',
        //   });
        // }
        if (email_verified) {
          Users.findOne({ email })
            .then((user) => {
              if (user) {
                const token = jwt.sign(
                  { _id: user._id },
                  process.env.JWT_SIGNIN_KEY,
                  { expiresIn: "7d" }
                );
                const { _id, name, email, username, avatar, role, lineToken } =
                  user;
                res.cookie("tokenId", tokenId, {
                  path: "/api/google-token",
                  httpOnly: false,
                  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                  secure: true,
                  sameSite: "none",
                });
                res.json({
                  token,
                  user: {
                    _id,
                    name,
                    email,
                    username,
                    avatar,
                    role,
                    lineToken,
                  },
                });
              } else {
                let password = email + process.env.JWT_SIGNIN_KEY;
                const username = email.split("@")[0];
                let newUser = new Users({
                  email,
                  avatar: picture,
                  name,
                  username,
                  password,
                });
                newUser
                  .save()
                  .then((data) => {
                    const token = jwt.sign(
                      { _id: data._id },
                      process.env.JWT_SIGNIN_KEY,
                      { expiresIn: "7d" }
                    );
                    const {
                      _id,
                      name,
                      email,
                      username,
                      avatar,
                      role,
                      lineToken,
                    } = newUser;
                    res.cookie("tokenId", tokenId, {
                      path: "/api/google-token",
                      httpOnly: false,
                      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                      secure: true,
                      sameSite: "none",
                    });
                    res.json({
                      token,
                      user: {
                        _id,
                        name,
                        email,
                        username,
                        avatar,
                        role,
                        lineToken,
                      },
                    });
                  })
                  .catch((err) => {
                    return res.status(400).json({
                      error: "Something went wrong",
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(400).json({
                error: "Something went wrong",
              });
            });
        }
      })
      .catch((err) => {
        res.clearCookie("tokenId", { path: "/api/google-token" });
        return res.status(500).json({ msg: "Token is expired" });
      });
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("tokenId", { path: "/api/google-token" });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  lineToken: async (req, res) => {
    const { lineToken } = req.body;
    try {
      const updatedUser = await Users.findByIdAndUpdate(
        req.user._id,
        { lineToken: lineToken },
        { new: true }
      );
      if (!updatedUser)
        return res.status(400).json({ msg: "User does not exit" });
      res.status(200).json("Updated Successfully");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  lineAuth: async (req, res) => {
    const { formData } = req.body;

    try {
      const access_token = await authLineToken(formData);
      const updatedUser = await Users.findByIdAndUpdate(
        req.user._id,
        { lineToken: access_token },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ msg: "User does not exist" });
      }

      res.status(200).json({ status: "OK", lineToken: updatedUser.lineToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
  lineRevoke: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
      }
      if (user.tokenId === "") {
        return res.status(400).json({ msg: "Token does not exist" });
      }
      const status = await authLineRevoke(user.lineToken);
      if (status === 200) {
        const updatedUser = await Users.findByIdAndUpdate(
          req.user._id,
          { lineToken: "" },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(400).json({ msg: "User does not exist" });
        }
      } else {
        return res.status(400).json({ msg: "Revoke Failed" });
      }
      res.status(200).json({ status: "OK" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal server error" });
    }
  },
};

module.exports = authCtrl;
