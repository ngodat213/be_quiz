const mongoose = require('mongoose');
// Models
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id,
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.oders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product)
                return res.status(404).json({
                    message: "Product not found",
                });

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create order successfully!",
                createOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id,
                    }
                },
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(order => {
        console.log("From database", order);
        if(order){
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/',
                }
            });
        }else{
            res.status(404).json({message: 'Order not found'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.orders_delete_oder = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: 'http://localhost:3000/orders/',
                body: {productId: 'String', quantity: "Number"}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}