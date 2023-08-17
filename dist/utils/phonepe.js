"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phonePePay = exports.phonePeVerify = void 0;
const axios_1 = require("axios");
const base64url = require("base64-url");
const crypto = require("crypto");
async function makePaymentRequest(options) {
    try {
        const response = await axios_1.default.request(options);
        return response.data.data.instrumentResponse.redirectInfo.url;
    }
    catch (error) {
        console.error(error);
        throw new Error('Payment request failed.');
    }
}
async function verifyPaymentRequest(options) {
    try {
        const response = await axios_1.default.request(options);
        return response.data;
    }
    catch (error) {
        console.error(error);
        throw new Error('Payment request failed.');
    }
}
async function phonePeVerify(newMerchantTransactionId) {
    const salt_key = process.env.PHONE_PE_SALT_KEY_PROD;
    const salt_index = process.env.PHONE_PE_SALT_INDEX_PROD;
    const merchantId = process.env.PHONE_PE_MERCHANT_ID_PROD;
    const concatenated_string = `/pg/v1/status/${merchantId}/${newMerchantTransactionId}` + salt_key;
    const hashed_string = crypto.createHash('sha256').update(concatenated_string).digest('hex');
    const x_verify_header_value = hashed_string + '###' + salt_index;
    const url = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${newMerchantTransactionId}`;
    const options = {
        method: 'GET',
        url: url,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': x_verify_header_value,
            'X-MERCHANT-ID': merchantId
        }
    };
    const data = await verifyPaymentRequest(options);
    return data;
}
exports.phonePeVerify = phonePeVerify;
async function phonePePay(amountInPaise, newMerchantTransactionId, newMerchantUserd) {
    try {
        let payload = {
            "merchantId": process.env.PHONE_PE_MERCHANT_ID_PROD,
            "merchantTransactionId": `${newMerchantTransactionId}`,
            "merchantUserId": `${newMerchantUserd}`,
            "amount": `${amountInPaise}`,
            "redirectUrl": "https://merch.takeuforward.org/test/paymentStatus",
            "redirectMode": "POST",
            "callbackUrl": "https://api.takeuforward.org/api/merchandise/phonepe",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        };
        const salt_key = process.env.PHONE_PE_SALT_KEY_PROD;
        const salt_index = process.env.PHONE_PE_SALT_INDEX_PROD;
        const merchantId = process.env.PHONE_PE_MERCHANT_ID_PROD;
        const payload_json = JSON.stringify(payload, null, " ");
        // Base64 encode the payload
        const encoded_payload = base64url.encode(payload_json);
        // Concatenate payload with "/pg/v1/pay" and the salt key
        const concatenated_string = encoded_payload + '/pg/v1/pay' + salt_key;
        // Calculate the SHA256 hash
        const hashed_string = crypto.createHash('sha256').update(concatenated_string).digest('hex');
        // Concatenate the hashed string with "###" and the salt index
        const x_verify_header_value = hashed_string + '###' + salt_index;
        const url = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';
        const options = {
            method: 'POST',
            url: url,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': x_verify_header_value
            },
            data: {
                request: encoded_payload
            }
        };
        const paymentUrl = await makePaymentRequest(options);
        return paymentUrl;
    }
    catch (error) {
        console.log(error);
    }
}
exports.phonePePay = phonePePay;
