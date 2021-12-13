const {users} = require("../../models")

const Joi = require("joi")

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")


exports.register = async (req, res) => {
    const schema = Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().min(8).required(),
        fullName : Joi.string().min(3).required(),
        gender: Joi.string(),
        phone : Joi.string().min(11).required(),
        role : Joi.string()
    })

    const { error } = schema.validate(req.body)
    console.log(error);

    if(error) {
        return res.status(400).send({
            error: {
                message : error.details[0].message
            }
        })
    }

    const isDup = await users.findOne({
        where: {
            email: req.body.email
        }
    })
    

    if(isDup) {
        return res.status(400).send({
            error: {
                message: "Your email is already registered!"
            }
        })
    }
    
    try {

        const data = req.body

        const salt = await bcrypt.genSalt(10)

        hashedPass = await bcrypt.hash(data.password, salt)

        

        const response = await users.create({
            ...data,
            password: hashedPass
        })

        const token = jwt.sign({ id: response.id }, process.env.TOKEN_KEY)

        res.status(200).send({
            status: "success",
            message: "Thank you for joining the WaysFood!",
            data : {
                
                fullName: response.fullName,
                email: response.email,
                token_key: token
            }
        })
        

    } catch (error) {
        console.log(error) 
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
    
}

exports.login = async (req, res) => {
    
    const data = req.body
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    })

    const {error} = schema.validate(data)

    if (error) {
        return res.status(400).send({
            stasus: 'error',
            message: error.details[0].message,
        });
    }


    try {
        

        const response = await users.findOne({
            where: {
                email: data.email
            }
        })

        if (!response) {
            return res.status(400).send({
              stasus: 'Failed',
              message: 'Your email is not registered, please register your email!',
            });
        }

        const isPassValid = await bcrypt.compare(data.password, response.password)

        if(!isPassValid) {
            return res.status(400).send({
                stasus: "Failed",
                message: "Incorrect Password!"
            })
        }

        const token = jwt.sign({ id: response.id }, process.env.TOKEN_KEY);
        req.headers = {
            ...req.headers,
            api_key: token
        }
        
        res.status(200).send({
            status: "Success",
            message: "Login success",
            data: {
                user: {
                    id: response.id,
                    fullName: response.fullName,
                    email: response.email,
                    role: response.role,
                    phone: response.phone,
                    image: response.image,
                    location: response.location,
                    gender: response.gender,
                    token_key: token
                }
            }
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
        
    }
}

exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;
  
      const dataUser = await users.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
  
      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }
  
      res.send({
        status: "success...",
        data: {
          user: dataUser
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
  };