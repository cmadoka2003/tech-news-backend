const express = require('express');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const bcrypt = require("bcrypt");
const uid2 = require("uid2")
const router = express.Router();

router.post("/signup", function (req, res) {
    if (!checkBody(req.body, ["username", "password"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    const hash = bcrypt.hashSync(req.body.password, 10);

    User.findOne({ username: req.body.username }).then((data) => {
        if (data === null) {
            const newUser = new User({
                username: req.body.username,
                password: hash,
                token: uid2(32),
                canBookmarks : true
            });

            newUser.save().then((data) => {
                res.json({ result: true, token: data.token });
            });
        } else {
            res.json({ result: false, error: "Username already exists" });
        }
    });
})

router.post("/signin", (req, res) => {
    if (!checkBody(req.body, ["username", "password"])) {
        res.json({ result: false, error: "Missing or empty fields" });
        return;
    }

    User.findOne({ username: req.body.username }).then((data) => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ result: true, token: data.token });
        } else {
            res.json({ result: false, error: "User not found" });
        }
    });
});

router.get("/canBookmarks/:token", (req, res) => {
    User.findOne({ token : req.params.token }).then(data => {
        if(data){
            res.json({ result: true, canBookmarks: data.canBookmarks })
        }else{
            res.json({ result: false, error: "User not found" })
        }
    })
})
module.exports = router;
