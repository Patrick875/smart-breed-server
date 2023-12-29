//jshint esversion:9
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
const sendToken = (user, statusCode, req, res) => {
	const token = signToken(user.id);
	const cookieOptions = {
		expire: new Date(Date.now()) + process.env.JWT_EXPIRATION_NUM,
	};

	res.cookie("jwt", token, cookieOptions);
	user.password = undefined;
	res.status(statusCode).json({
		status: "Success",
		token,
		user,
	});
};
exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json({
			results: users.length,
			users: users,
		});
	} catch (error) {}
};
exports.signup = async (req, res, next) => {
	try {
		const newUser = await User.create({
			fullname: req.body.fullname,
			email: req.body.email,
			password: req.body.password,
			telephone: req.body.telephone,
		});

		sendToken(newUser, 201, req, res);
	} catch (err) {
		console.log(err.message);
		return res.status(401).json({
			status: "fail",
			error: {
				name: err.name,
				message: err.message,
			},
		});
	}
};
exports.login = async (req, res, next) => {
	try {
		const { password, userCredentials } = req.body;
		// const userCredentials = req.body.user;
		if (!userCredentials || !password) {
			return res.status(401).json({
				status: "fail",
				message: "to login please provide both the email and the password",
			});
		}
		const user = await User.findOne({
			$or: [{ email: userCredentials }, { telephone: userCredentials }],
		}).select("+password");

		if (!user || !(user.password === password)) {
			return res.status(400).json({
				status: "fail",
				message: "incorrect email or password",
			});
		}

		sendToken(user, 200, req, res);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: "request failed",
			message: "error loging in ",
		});
	}
};

exports.logout = (req, res) => {
	res.cookie("jwt", "", {
		maxAge: 300,
	});
	res.status(200).json({
		status: "success",
		message: "logedout",
	});
};
