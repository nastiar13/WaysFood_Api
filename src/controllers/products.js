const {products, users} = require('../../models')

exports.addProduct = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const response = await products.create({
            ...data,
            userId: id,
            image: process.env.FILE_PATH + req.file.filename
        })


        const newProduct = await products.findOne({
            where: {
                id: response.id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: users,
                as: "owner",
                attributes: {
                    exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                }
            }
        })

        res.send({
            status: 200,
            data: {
                newProduct
            }
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "Failed",
            message: "Server Error"
            
        })
        
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const response = await products.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: users,
                as: "owner",
                attributes: {
                    exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                }
            }
        })
        

        res.status(200).send({
            status: "Success",
            message: "Success get all products",
            data: {
                products: response
            }

        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error"
        })
        
    }
}
exports.getAllProductsById = async (req, res) => {
    try {
        const response = await products.findAll({
            where: {
                userId: req.params.id
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: users,
                as: "owner",
                attributes: {
                    exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                }
            }
        })

        res.status(200).send({
            status: "Success",
            message: `Success get all products of ${response[0].owner.fullName}`,
            data: {
                products: response
            }

        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error"
        })
        
    }
}
exports.getDetailsProduct = async (req, res) => {
    try {
        const response = await products.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: []
            },
            include: {
                model: users,
                as: "owner",
                attributes: {
                    exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                }
            }
        })

        res.status(200).send({
            status: "Success",
            message: "Success get detail product",
            data: {
                details: response
            }

        })

        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server Error"
        })
        
    }
}

exports.editProduct = async (req, res) => {
    try {
        const fs = require('fs')
        const id = req.params.id
        const path = './uploads/'
        const oldData = await products.findOne({
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })
        const oldImg = oldData.image.split('/')[4]
        const response = await products.update({
            ...req.body,
            image: process.env.FILE_PATH + req.file.filename
        },
        {
            where: {
                id
            }
        })
        const newData = await products.findOne({
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            },
            include: {
                model: users,
                as: "owner",
                attributes: {
                    exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                }
            }
        })
        fs.unlink(path+oldImg, () => console.log(oldImg+ " is deleted"))
        res.status(200).send({
            status: "Success",
            message: "Success updating product",
            productUpdated : response[0],
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

exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const response = await products.destroy({
            where: {
                id
            }

        })
        res.status(200).send({
            status: "Success",
            message: "Success deleting product",
            data: {
                productDeleted: response
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