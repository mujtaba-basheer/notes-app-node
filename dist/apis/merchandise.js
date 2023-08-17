"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAddress = exports.getCoupon = exports.checkCoupon = exports.orderStatus = exports.verifyPayment = exports.saveMerchUserAndCart = exports.getSingleProduct = exports.getProducts = void 0;
const db_1 = require("../db");
const app_error_1 = require("../utils/app-error");
const catch_async_1 = require("../utils/catch-async");
const helper_1 = require("../utils/helper");
const phonepe_1 = require("../utils/phonepe");
let totalCartPrice = 0;
// Function to Get Products
exports.getProducts = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // SQL query to select all products from the database
        let qs = "SELECT * FROM products";
        // Execute the query using the database connection
        db_1.default.query(qs, (err, results, fields) => {
            if (err)
                return next(new app_error_1.default(err.message, 403));
            // Create a new array to store the modified product data
            const newData = [];
            // Loop through the results to modify the data and store it in the newData array
            for (const result of results) {
                // Extract images from the result and store the remaining data in the 'data' variable
                const { image1, image2, image3, image4 } = result, data = __rest(result, ["image1", "image2", "image3", "image4"]);
                // Create a new object with the modified data, adding an 'images' property that contains an array of image URLs
                const newObject = Object.assign(Object.assign({}, data), { images: [image1, image2, image3, image4] });
                // Push the new object to the newData array
                newData.push(newObject);
            }
            // console.log(newData)
            // Send the modified data as a response to the client
            res.status(200).json({
                ok: true,
                data: newData,
            });
        });
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
// Function to Get Single Product by its slug
exports.getSingleProduct = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // Extract the 'slug' from the request query
        const { slug } = req.query;
        // SQL query to select a single product from the database based on the slug
        let qs = `SELECT * FROM products WHERE slug="${slug}";`;
        // Execute the query using the database connection
        db_1.default.query(qs, (err, results, fields) => {
            if (err)
                return next(new app_error_1.default(err.message, 403));
            // Create an empty object to store the modified product data
            let newObject = {};
            // Loop through the results to modify the data and store it in the 'newObject'
            for (const result of results) {
                // Extract images from the result and store the remaining data in the 'data' variable
                const { image1, image2, image3, image4 } = result, data = __rest(result, ["image1", "image2", "image3", "image4"]);
                const imagesArray = [image1, image2, image3, image4].filter(image => image !== null);
                newObject = Object.assign(Object.assign({}, data), { images: imagesArray });
            }
            // Send the modified data as a response to the client
            res.status(200).json({
                ok: true,
                data: newObject,
            });
        });
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
exports.saveMerchUserAndCart = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        const { new_sub } = req.body;
        totalCartPrice = new_sub;
        let amountInPaise = parseInt((new_sub * 100).toFixed(0));
        const newMerchantTransactionId = (0, helper_1.generateMerchantTransactionId)();
        const newMerchantUserd = (0, helper_1.generateMerchantUserId)();
        const paymentUrl = await (0, phonepe_1.phonePePay)(amountInPaise, newMerchantTransactionId, newMerchantUserd);
        res.status(201).json({
            newMerchantTransactionId,
            paymentUrl,
        });
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
exports.verifyPayment = (0, catch_async_1.default)(async (req, res, next) => {
    const { newMerchantTransactionId, userData, storedCartItems, paymentDetails } = req.body;
    const { fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber } = userData;
    let userExists = await (0, helper_1.getUserByEmail)(email);
    const generateUserId = (0, helper_1.generateRandomId)(8);
    if (userExists) {
        let updateUserQs = `UPDATE merch_users
                    SET fullName=?, pincode=?, city=?, state=?, flatNo=?, area=?, landmark=?, addressType=?, phoneNumber=?
                    WHERE email=?`;
        const updateValues = [fullName, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber, email];
        db_1.default.query(updateUserQs, updateValues, (error, results) => {
            if (error) {
                console.error('Error updating data:', error);
            }
        });
    }
    else {
        let insertUserQs = `INSERT INTO merch_users (id, fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const insertValues = [generateUserId, fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber];
        db_1.default.query(insertUserQs, insertValues, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
            }
        });
    }
    let newExists = await (0, helper_1.getUserByEmail)(email);
    let userId = newExists.id;
    const generateCartId = (0, helper_1.generateRandomId)(8);
    // Insert the cart data into the carts table
    let cartQs = `INSERT INTO merch_carts (userId, totalPrice, cartItems, cartId) VALUES (?, ?, ?, ?)`;
    console.log(totalCartPrice);
    const cartValues = [userId, totalCartPrice, JSON.stringify(storedCartItems), generateCartId];
    const data = await (0, phonepe_1.phonePeVerify)(newMerchantTransactionId);
    // console.log(data)
    const { code, success, data: { merchantTransactionId, transactionId } } = data;
    let payQs = `INSERT INTO merch_payments (merchant_user_id, transaction_id, cartId, userId ) VALUES (?,?, ?, ?)`;
    const payValues = [merchantTransactionId, transactionId, generateCartId, userId];
    if (success && code === 'PAYMENT_SUCCESS') {
        (0, helper_1.sendEmail)(email, newMerchantTransactionId, totalCartPrice, fullName, paymentDetails);
        db_1.default.query(cartQs, cartValues, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
            }
            else {
                console.log('Cart Inserted successfully');
            }
        });
        db_1.default.query(payQs, payValues, (error, results) => {
            if (error) {
                console.error('Error inserting data:', error);
            }
            else {
                console.log('Payment Details Inserted successfully');
            }
        });
        res.status(201).json({
            message: `Congratulations!`, ok: true, redirect: false, merchantTransactionId, transactionId
        });
    }
    if (!success && code === 'PAYMENT_ERROR') {
        res.status(201).json({
            redirect: true
        });
    }
});
exports.orderStatus = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // Extract data from the request body
        const { formData } = req.body;
        // Extract individual properties from formData
        const { newMerchantTransactionId } = formData;
        // // SQL query to select the cart_status from the carts table and merch_payments table
        let statusQs = `SELECT c.cartStatus, c.cartItems FROM merch_carts AS c, merch_payments AS mp WHERE c.cartId = mp.cartId AND mp.merchant_user_id = '${newMerchantTransactionId}'`;
        // Execute the query using the database connection
        db_1.default.query(statusQs, (err, results, fields) => {
            if (err)
                return next(new app_error_1.default(err.message, 403));
            // Extract the cart_status from the query results
            let status, cartItems;
            if (results) {
                status = results[0].cartStatus;
                cartItems = results[0].cartItems;
            }
            else {
                res.status(201).json({
                    ok: false,
                });
            }
            // Send the order status as a response to the client
            res.status(201).json({
                ok: true,
                data: status,
                cartItems
            });
        });
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
// Function to check and apply a coupon code for the merch store
exports.checkCoupon = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // Extract data from the request body
        const { couponCode } = req.body;
        // SQL query to select the discount from the merch_coupons table based on the provided coupon code
        const couponQs = `
                SELECT discount
                FROM merch_coupons
                WHERE coupon = '${couponCode}' AND isActive = 1
                LIMIT 1
            `;
        // Execute the query using the database connection
        db_1.default.query(couponQs, (error, results) => {
            if (error) {
                console.error('Error executing the query:', error);
            }
            else {
                // Extract the discount from the query results (if available), otherwise set it to 0
                const discount = results.length > 0 ? results[0].discount : 0;
                // Send the discount as a response to the client
                res.json({ discount });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCoupon = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // SQL query to select the discount from the merch_coupons table based on the provided coupon code
        const couponQs = `
                SELECT discount, coupon
                FROM merch_coupons
                WHERE isActive = 1
            `;
        // Execute the query using the database connection
        db_1.default.query(couponQs, (error, results) => {
            if (error) {
                console.error('Error executing the query:', error);
            }
            else {
                res.json({ results });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.editAddress = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        // Extract data from the request body
        const { updatedData } = req.body;
        const { fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber } = updatedData;
        // console.log(updatedData);
        let userExists = await (0, helper_1.getUserByEmail)(email);
        // Generate a random user ID
        const generateUserId = (0, helper_1.generateRandomId)(8);
        if (userExists) {
            // If the user already exists, update their data in the merch_users table
            let updateUserQs = `UPDATE merch_users
                        SET fullName=?, pincode=?, city=?, state=?, flatNo=?, area=?, landmark=?, addressType=?, phoneNumber=?
                        WHERE email=?`;
            const updateValues = [fullName, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber, email];
            db_1.default.query(updateUserQs, updateValues, (error, results) => {
                if (error) {
                    console.error('Error updating data:', error);
                }
                else {
                    // console.log(results);
                    res.status(201).json({
                        ok: true,
                        results
                    });
                }
            });
        }
        else {
            // If the user does not exist, insert the user data into the merch_users table
            let insertUserQs = `INSERT INTO merch_users (id, fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const insertValues = [generateUserId, fullName, email, pincode, city, state, flatNo, area, landmark, addressType, phoneNumber];
            db_1.default.query(insertUserQs, insertValues, (error, results) => {
                if (error) {
                    console.error('Error inserting data:', error);
                }
                else {
                    // console.log(results);
                    res.status(201).json({
                        ok: true,
                        results
                    });
                }
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
