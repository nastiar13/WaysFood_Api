const express = require('express')


const router = express.Router()


const {addProduct, getAllProducts, deleteProduct, getAllProductsById, getDetailsProduct, editProduct } = require('../controllers/products')
const {register, login, checkAuth} = require('../controllers/auth')
const {auth} = require("../middlewares/auth")
const { getRestaurant, getAllUsers, getUser, deleteUser, editUser } = require("../controllers/users")
const {addTransaction, getCustomerTransactions, getSellerTransactions, getDetailTransaction, deleteTransaction, editTransaction} = require('../controllers/transactions')
const {uploadFiles} = require('../middlewares/uploadFiles')



// model products
router.post('/product/:id', auth, uploadFiles('image'), addProduct)
router.get('/products', getAllProducts)
router.get('/products/:id', getAllProductsById)
router.get('/product/:id', getDetailsProduct)
router.patch('/product/:id', auth, uploadFiles('image'), editProduct)
router.delete('/product/:id', auth, deleteProduct)

// model auth
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)

// model users
router.get('/restaurants', getRestaurant)
router.get('/users', getAllUsers)
router.get('/user/:id', getUser)
router.delete('/user/:id', deleteUser)
router.patch('/user/:id', uploadFiles('image'), editUser)

// model transactions
router.post('/transaction', auth, addTransaction)
router.get('/customer-transactions', auth, getCustomerTransactions)
router.get('/seller-transactions', auth, getSellerTransactions)
router.get('/details-transaction/:id', auth, getDetailTransaction)
router.delete('/transaction/:id', deleteTransaction)
router.patch('/transaction/:id',auth, editTransaction)


module.exports = router