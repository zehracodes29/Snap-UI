const express = require('express');
const Model = require('../models/Usermodel');

const router =express();

router.post('/add', (req,res) => {
    console.log(req.body);
    new Model(req.body).save()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

//getbyemail
router.get('/getbyemail/:email',(req,res)=>{
    Model.find({email:req.params.email})
    .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
    });

router.get('/getbyid/:id', (req,res) =>
{
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

router.delete('/delete/:id', (req,res) => {
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
router.put('/update/:id',(req,res)=>{
    Model.findByIdAndUpdate(req.params.id,req.body,{ new:true })
    .then((result)=>{
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/getall', (req,res) => {
    Model.find()//find is also an asynchronous operation
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/authenticate', (req, res) => {
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                const { _id, email } = result;
                // process login
                jwt.sign(
                    { _id, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '15' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json(err);
                        } else {
                            res.status(200).json({ token });
                        }
                    }
                )
            } else {
                res.status(403).json({ message: 'Invalid Credentials' });
            }

        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;