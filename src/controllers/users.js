const { users, products } = require("../../models")

exports.getRestaurant = async (req, res) => {
    try {
        const response = await users.findAll({
            where: {
                role: "restaurant"
            },
            include: {
                model: products,
                as: "products",
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        })

        res.status(200).send({
            status: "success",
            data: response
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Failed"
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
    const response = await users.findAll({
        attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
        }
    })
    res.status(200).send({
        status: "Success",
        message: "Success get all users",
        data: {
            users: response
        }
    })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
    }


}

exports.getUser = async (req, res) => {
    try {
    const response = await users.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
        }
    })
    res.status(200).send({
        status: "Success",
        message: "Success get user",
        data: {
            user: response
        }
    })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
    }


}

exports.deleteUser = async (req, res) => {
    try {
        const response = await users.destroy({
            where: {
                id: req.params.id
            }
        })

        res.status(200).send({
            status: "Success",
            message: "Success deleting user",
            data: {
                userDeleted: response
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
exports.editUser = async (req, res) => {
    try {
        const fs = require('fs')
        const path = './uploads/'
        const id = req.params.id
        const data = req.body
        
        const oldData = await users.findOne({
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"]
            }
        })
        const oldImg = oldData.image.split('/')[4]
        const response = await users.update({
            ...data,
            image: process.env.FILE_PATH + req.file.filename
            
        },
        {
            where: {
                id
            }
        })
        const newData = await users.findOne({
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"]
            }
        })
        
        fs.unlink(path+oldImg, () => console.log(oldImg+" is deleted"))
        res.status(200).send({
            status: "Success",
            message: "Success updating user",
            usertUpdated : response[0],
            newData
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
        
    }
}