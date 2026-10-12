const crypto = require('crypto');
const User = require('../models/User');

const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require('../config/mailer');

const EMAIL_SUFFIX = '.sherubtse@rub.edu.bt';

exports.showSignup = (req, res) => {
    res.render('signup', {
        title: 'Sign Up',
        error: null
    });
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.render('signup', {
                title: 'Sign Up',
                error: 'All fields are required.'
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        if (!normalizedEmail.endsWith(EMAIL_SUFFIX)) {
            return res.render('signup', {
                title: 'Sign Up',
                error:
                    `Please use your Sherubtse College email, ending in ${EMAIL_SUFFIX}.`
            });
        }

        const existing =
            await User.findByEmail(normalizedEmail);

        /*
         * If the email already exists but the account
         * has NOT been verified, generate a new token
         * and send another verification email.
         */
        if (existing) {
            if (!existing.is_verified) {
                const verificationToken =
                    crypto.randomBytes(20).toString('hex');

                await User.updateVerificationToken(
                    normalizedEmail,
                    verificationToken
                );

                await sendVerificationEmail(
                    normalizedEmail,
                    verificationToken
                );

                return res.render('signup-success', {
                    title: 'Check Your Email',
                    email: normalizedEmail
                });
            }

            return res.render('signup', {
                title: 'Sign Up',
                error: 'That email is already registered.'
            });
        }

        /*
         * New user
         */
        const verificationToken =
            crypto.randomBytes(20).toString('hex');

        await User.createUser({
            name,
            email: normalizedEmail,
            password,
            verificationToken
        });

        await sendVerificationEmail(
            normalizedEmail,
            verificationToken
        );

        res.render('signup-success', {
            title: 'Check Your Email',
            email: normalizedEmail
        });

    } catch (error) {
        console.error(
            'Signup/email verification error:',
            error
        );

        res.render('signup', {
            title: 'Sign Up',
            error:
                'Unable to complete registration. Please try again.'
        });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const user =
            await User.markVerified(req.params.token);

        if (!user) {
            return res
                .status(400)
                .send(
                    'Invalid or expired verification link.'
                );
        }

        res.render('verify-success', {
            title: 'Verified',
            user
        });

    } catch (error) {
        console.error(
            'Email verification error:',
            error
        );

        res
            .status(500)
            .send('Unable to verify your email.');
    }
};

exports.showLogin = (req, res) => {
    res.render('login', {
        title: 'Log In',
        error: null
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user =
        await User.findByEmail(
            email.trim().toLowerCase()
        );

    if (
        !user ||
        !(await User.verifyPassword(
            password,
            user.password_hash
        ))
    ) {
        return res.render('login', {
            title: 'Log In',
            error: 'Incorrect email or password.'
        });
    }

    if (!user.is_verified) {
        return res.render('login', {
            title: 'Log In',
            error:
                'Please verify your email before logging in.'
        });
    }

    req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role
    };

    if (user.role === 'superadmin') {
        return res.redirect(
            '/superadmin/dashboard'
        );
    }

    if (user.role === 'admin') {
        return res.redirect(
            '/admin/dashboard'
        );
    }

    res.redirect('/');
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');

    });
};

exports.showForgotPassword = (req, res) => {
    res.render('forgot-password', {
        title: 'Forgot Password',
        message: null
    });
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user =
        await User.findByEmail(
            email.trim().toLowerCase()
        );

    if (user) {
        const token =
            crypto.randomBytes(20).toString('hex');

        const expires =
            new Date(
                Date.now() + 60 * 60 * 1000
            );

        await User.setResetToken(
            email.trim().toLowerCase(),
            token,
            expires
        );

        await sendPasswordResetEmail(
            email.trim().toLowerCase(),
            token
        );
    }

    res.render('forgot-password', {
        title: 'Forgot Password',
        message:
            'If an account exists with that email, a reset link has been sent.'
    });
};

exports.showResetPassword = async (req, res) => {
    const user =
        await User.findByResetToken(
            req.params.token
        );

    if (!user) {
        return res
            .status(400)
            .send(
                'This reset link is invalid or has expired.'
            );
    }

    res.render('reset-password', {
        title: 'Reset Password',
        token: req.params.token,
        error: null
    });
};

exports.resetPassword = async (req, res) => {
    const {
        password,
        confirmPassword
    } = req.body;

    const user =
        await User.findByResetToken(
            req.params.token
        );

    if (!user) {
        return res
            .status(400)
            .send(
                'This reset link is invalid or has expired.'
            );
    }

    if (
        !password ||
        password.length < 6 ||
        password !== confirmPassword
    ) {
        return res.render('reset-password', {
            title: 'Reset Password',
            token: req.params.token,
            error:
                'Passwords must match and be at least 6 characters.'
        });
    }

    await User.resetPassword(
        user.id,
        password
    );

    res.redirect('/login');
};