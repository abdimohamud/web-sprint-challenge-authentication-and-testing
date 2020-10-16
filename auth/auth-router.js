const router = require('express').Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const {add, getAllUsers, findBy} = require("./auth-model")

router.get("/users",  (req,res,next) => {
    getAllUsers()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            console.log(err)
            res.status(401).json({message: "invalid credentials"})
        })
})

router.post("/register", async (req,res,next) => {

    try {
        if(req.body){
            const {username, password} = req.body
            const user = {
                username,
                password: await bcrypt.hash(password, 6)
      }
      await add(user)
      res.status(201).json({message: `${username} added`})
        }
    } catch(err) {
        next(err)
    }
})

router.post('/login', (req, res) => {
    //Login user
    let { username, password } = req.body;
        findBy({ username }).first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                delete user.password
                res.status(200).json({
                    id: user.id,
                    message: `Welome ${user.username}`,
                    token,
                });
            } else {
                res.status(401).json({
                    message: "Invalid Credentials"
                })
            }
        })
        .catch(({ message }) => {
            res.status(500).json({
                message
            });
        })
});
function generateToken(user) {
    //Header payload and verify signature
    const payload = {
        username: user.username,
    };
    //Token expiration
    const options = {
        expiresIn: "1d"
    }
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}

module.exports = router;