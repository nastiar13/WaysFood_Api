const { transactions, users, products, productTransactions, Sequelize } = require('../../models')


exports.addTransaction = async (req, res) => {
    try {
        const data = req.body
        let totalProducts = 0
        let totalPrice = 0
        data.forEach(c => {
            totalPrice += c.totalPrice
            totalProducts += c.quantityProduct
        })


        const response = await transactions.create({
            customerId: data[0].customerId,
            sellerId: data[0].sellerId,
            quantityProduct: totalProducts,
            totalPrice: totalPrice
        })

        data.forEach( async b => {
            await productTransactions.create({
            productId: b.productId,
            quantity: b.quantityProduct,
            transactionId: response.id
            })
        })

        data.forEach( async a => {
            await products.update({
                quantity: Sequelize.literal(`quantity - ${a.quantityProduct}`)
            },
            {
                where: {
                    id: a.productId
                }
            })
            
            
        })

        let product = []
        data.forEach(a => {
            product.push({
                id: a.productId,
                quantity: a.quantityProduct
            })
        })
        

        res.status(200).send({
            status: "Success",
            message: "Transaction success",
            data: {
                products: product
            },
            transaction: response

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
        
    }
}


exports.getCustomerTransactions = async (req, res) => {
    console.log(req.user);
    try {
        const response = await transactions.findAll({
            where: {
                customerId: req.user.id
            },
            attributes: {
                exclude: ["updatedAt"]
            },
            include: [
                {
                    model: products,
                    as: "products",
                    through: {
                        model: productTransactions,
                        
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "quantity"]
                    }
                },
                {
                    model: users,
                    as: "seller",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "quantity"]
                    }
                },
            ]
        })

        res.status(200).send({
            status: "Success",
            message: "Success get all transactions",
            data: response

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status : "Failed",
            message: "Server error"
        })
        
    }
}
exports.getSellerTransactions = async (req, res) => {
    console.log(req.user);
    try {
        const response = await transactions.findAll({
            where: {
                sellerId: req.user.id
            },
            include: [
                {
                    model: products,
                    as: "products",
                    through: {
                        model: productTransactions,
                        
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "quantity"]
                    }
                },
                {
                    model: users,
                    as: "customer",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "quantity"]
                    }
                },
            ]
        })

        res.status(200).send({
            status: "Success",
            message: "Success get all transactions",
            data: response

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status : "Failed",
            message: "Server error"
        })
        
    }
}

exports.getDetailTransaction = async (req, res) => {
    try {
        const id = req.params.id

        const response = await transactions.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: users,
                    as: "customer",
                    attributes: {
                        exclude: ["password", "location", "image", "createdAt", "updatedAt"]
                    }
                },
                {
                    model: products,
                    as: "products",
                    through: {
                        model: productTransactions,
                        as: "bridge",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "quantity"]
                    }
                }
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })
        res.status(200).send({
            status: "Success",
            message: `Success get transaction with id ${id}`,
            data: {
                response
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

exports.deleteTransaction = async (req, res) => {
    try {
        const id = req.params.id
        const response = await transactions.destroy({
            where: {
                id
            }
        })

        res.status(500).send({
            status: "Success",
            message: "Success deleting transaction",
            dataDeleted: response
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Failed",
            message: "Server error"
        })
        
    }
}

exports.editTransaction = async (req, res) => {
    try {

        const response = await transactions.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        const newData = await transactions.findOne({
            where: {
                id: req.params.id
            }
        })
        res.status(200).send({
            status: "Success",
            message: "Success updating",
            data: {
                transaction: newData
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