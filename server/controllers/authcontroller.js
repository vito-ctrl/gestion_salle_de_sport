const User = require('../models/authmodels');
const jwt = require('jsonwebtoken');
const creatError = require('../utils/appError');
const bcrypt = require('bcryptjs');

exports.signup = async(req, res, next) => {

    try{
        const user = await User.findOne({email: req.body.email});
        if(user){
            return next(new creatError('user already exists!', 400));
        }
        const hashedpassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await User.create({
            ...req.body,
            password: hashedpassword,
        });
        //jwt token
        const token = jwt.sign({_id: newUser._id}, 'scretkey123',{
            expiresIn: '10d',
        });
        res.status(201).json({
            status: 'success',
            massage: 'user registerd successfully',
            token,
        })

    } catch(error){
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return next(new creatError ("User not found!", 404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return next(new creatError("ivalide password", 400
            ));
        }

        const token = jwt.sign({_id: user._id}, 'scretkey123',{
            expiresIn: '10d',
        });

        res.status(200).json({
            status: 'success',
            token,
            message: 'login in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        })
    } catch (error){
        next(error);
    }
};