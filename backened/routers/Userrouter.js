const express = require('express');
const Model = require('../models/Usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express();

// Signup endpoint with password hashing
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await Model.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Model({
            name,
            email,
            password: hashedPassword
        });

        const result = await newUser.save();

        // Return user without password
        const { password: pwd, ...userWithoutPassword } = result.toObject();
        res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

//getbyemail
router.get('/getbyemail/:email', (req, res) => {
    Model.find({ email: req.params.email })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete operation

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


//update operation
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()//find is also an asynchronous operation
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Login endpoint with password verification
router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const { _id, email: userEmail, name } = user;
        const token = jwt.sign(
            { _id, email: userEmail, name },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' } // 7 days
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { _id, email: userEmail, name }
        });
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(500).json({ message: 'Error during authentication', error: err.message });
    }
});

module.exports = router;