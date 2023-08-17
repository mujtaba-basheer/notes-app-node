"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.getUserByEmail = exports.generateMerchantUserId = exports.generateMerchantTransactionId = exports.generateRandomId = void 0;
const nodemailer = require("nodemailer");
const db_1 = require("../db");
function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
    }
    return id;
}
exports.generateRandomId = generateRandomId;
function generateRandomString(length) {
    const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
        result += allowedCharacters[randomIndex];
    }
    return result;
}
// Function to generate the merchant transaction ID
function generateMerchantTransactionId() {
    const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
    const length = 10;
    let merchantTransactionId = 'MT';
    for (let i = 0; i < length - 2; i++) {
        const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
        merchantTransactionId += allowedCharacters[randomIndex];
    }
    return merchantTransactionId;
}
exports.generateMerchantTransactionId = generateMerchantTransactionId;
// Function to generate the merchant user ID
function generateMerchantUserId() {
    const length = 10;
    let merchantUserId = 'MUID';
    const alphanumericPartLength = length - merchantUserId.length;
    merchantUserId += generateRandomString(alphanumericPartLength);
    return merchantUserId;
}
exports.generateMerchantUserId = generateMerchantUserId;
async function getUserByEmail(email) {
    // Return a new Promise that resolves or rejects based on the query results
    return new Promise((resolve, reject) => {
        // SQL query to select all columns from the merch_users table where the email matches the provided email
        const query = `
        SELECT *
        FROM merch_users
        WHERE email = '${email}';
      `;
        // Execute the query using the database connection
        db_1.default.query(query, (err, results) => {
            if (err) {
                // If there's an error during the database query, reject the promise with the error
                reject(err);
                return;
            }
            // Check if any results were returned from the query
            if (results.length > 0) {
                // If a user with the provided email exists, resolve the promise with the first result
                resolve(results[0]);
            }
            else {
                // If no user with the provided email exists, resolve the promise with null
                resolve(null);
            }
        });
    });
}
exports.getUserByEmail = getUserByEmail;
async function sendEmail(email, newMerchantTransactionId, totalCartPrice, fullName, paymentDetails) {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        };
        let transporter = nodemailer.createTransport(config);
        let message = {
            from: 'hello@takeuforward.org',
            to: email,
            subject: "Payment Receipt",
            html: `
            <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <style type="text/css" rel="stylesheet" media="all">
        /* Base ------------------------------ */

        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");

        body {
            width: 100% !important;
            height: 100%;
            margin: 0;
            -webkit-text-size-adjust: none;
        }

        a {
            color: #3869D4;
        }

        a img {
            border: none;
        }

        .preheader {
            display: none !important;
            visibility: hidden;
            mso-hide: all;
            font-size: 1px;
            line-height: 1px;
            max-height: 0;
            max-width: 0;
            opacity: 0;
            overflow: hidden;
        }

        /* Type ------------------------------ */

        body,
        td,
        th {
            font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        }

        h1 {
            margin-top: 0;
            color: #333333;
            font-size: 22px;
            font-weight: bold;
            text-align: left;
        }

        h2 {
            margin-top: 0;
            color: #333333;
            font-size: 16px;
            font-weight: bold;
            text-align: left;
        }

        h3 {
            margin-top: 0;
            color: #333333;
            font-size: 14px;
            font-weight: bold;
            text-align: left;
        }

        td,
        th {
            font-size: 16px;
        }

        p,
        ul,
        ol,
        blockquote {
            margin: .4em 0 1.1875em;
            font-size: 16px;
            line-height: 1.625;
        }

        p.sub {
            font-size: 13px;
        }

        /* Utilities ------------------------------ */

        .align-right {
            text-align: right;
        }

        .align-left {
            text-align: left;
        }

        .align-center {
            text-align: center;
        }

        .u-margin-bottom-none {
            margin-bottom: 0;
        }

        /* Buttons ------------------------------ */

        .button {
            background-color: #ee4b2b;
            border: none;
            outline: none;
            padding: 10px 10px;
            color: #ffffff;
            font-size: 18px;
            text-decoration: none;
            /* background: #f3856f80;*/
            /*border: 2px solid #F3856F;*/
            /*color: #EE4B2B;*/
            /*font-weight: 600;*/
            /*font-size: 17px;*/
            /*border-radius: 10px;*/
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            transition: transform 200ms ease-in-out;
            transform-origin: center;
        }

        .button--green {
            background-color: #22BC66;
            border-top: 10px solid #22BC66;
            border-right: 18px solid #22BC66;
            border-bottom: 10px solid #22BC66;
            border-left: 18px solid #22BC66;
        }

        .button--red {
            background-color: #FF6136;
            border-top: 10px solid #FF6136;
            border-right: 18px solid #FF6136;
            border-bottom: 10px solid #FF6136;
            border-left: 18px solid #FF6136;
        }

        @media only screen and (max-width: 500px) {
            .button {
                width: 100% !important;
                text-align: center !important;
            }
        }

        /* Attribute list ------------------------------ */

        .attributes {
            margin: 0 0 21px;
        }

        .attributes_content {
            background-color: #F4F4F7;
            padding: 16px;
        }

        .attributes_item {
            padding: 0;
        }

        /* Related Items ------------------------------ */

        .related {
            width: 100%;
            margin: 0;
            padding: 25px 0 0 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
        }

        .related_item {
            padding: 10px 0;
            color: #CBCCCF;
            font-size: 15px;
            line-height: 18px;
        }

        .related_item-title {
            display: block;
            margin: .5em 0 0;
        }

        .related_item-thumb {
            display: block;
            padding-bottom: 10px;
        }

        .related_heading {
            border-top: 1px solid #CBCCCF;
            text-align: center;
            padding: 25px 0 10px;
        }

        /* Discount Code ------------------------------ */

        .discount {
            background-color: #ee4b2b;
            border: none;
            outline: none;
            padding: 10px 10px;
            color: #ffffff;
            font-size: 18px;
            text-decoration: none;
            /* background: #f3856f80;*/
            /*border: 2px solid #F3856F;*/
            /*color: #EE4B2B;*/
            /*font-weight: 600;*/
            /*font-size: 17px;*/
            /*border-radius: 10px;*/
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            transition: transform 200ms ease-in-out;
            transform-origin: center;
        }

        .discount_heading {
            text-align: center;
        }

        .discount_body {
            text-align: center;
            font-size: 15px;
        }

        /* Social Icons ------------------------------ */

        .social {
            width: auto;
        }

        .social td {
            padding: 0;
            width: auto;
        }

        .social_icon {
            height: 20px;
            margin: 0 8px 10px 8px;
            padding: 0;
        }

        /* Data table ------------------------------ */

        .purchase {
            width: 100%;
            margin: 0;
            padding: 35px 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
        }

        .purchase_content {
            width: 100%;
            margin: 0;
            padding: 25px 0 0 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
        }

        .purchase_item {
            padding: 10px 0;
            color: #51545E;
            font-size: 15px;
            line-height: 18px;
        }

        .purchase_heading {
            padding-bottom: 8px;
            border-bottom: 1px solid #EAEAEC;
        }

        .purchase_heading p {
            margin: 0;
            color: #85878E;
            font-size: 12px;
        }

        .purchase_footer {
            padding-top: 15px;
            border-top: 1px solid #EAEAEC;
        }

        .purchase_total {
            margin: 0;
            font-weight: bold;
            color: #333333;
        }
        .purchase_total--total {
            margin: 0;
            text-align: end;
            font-weight: bold;
            color: #333333;
        }

        .purchase_total--label {
            padding: 0 15px 0 0;
        }

        body {
            background-color: #F2F4F6;
            color: #51545E;
        }

        p {
            color: #51545E;
        }

        .email-wrapper {
            width: 100%;
            margin: 0;
            padding: 20px;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            background-color: #F2F4F6;
        }

        .email-content {
            width: 100%;
            margin: 0;
            padding: 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
        }

        /* Masthead ----------------------- */

        .email-masthead {
            padding: 25px 0;
            text-align: center;
        }

        .email-masthead_logo {
            width: 94px;
        }

        .email-masthead_name {
            font-size: 16px;
            font-weight: bold;
            color: #A8AAAF;
            text-decoration: none;
            text-shadow: 0 1px 0 white;
        }

        /* Body ------------------------------ */

        .email-body {
            width: 100%;
            margin: 0;
            padding: 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
        }

        .email-body_inner {
            width: 570px;
            margin: 0 auto;
            padding: 0;
            -premailer-width: 570px;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            background-color: #FFFFFF;
        }

        .email-footer {
            width: 570px;
            margin: 0 auto;
            padding: 0;
            -premailer-width: 570px;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            text-align: center;
        }

        .email-footer p {
            color: #A8AAAF;
        }

        .body-action {
            width: 100%;
            margin: 30px auto;
            padding: 0;
            -premailer-width: 100%;
            -premailer-cellpadding: 0;
            -premailer-cellspacing: 0;
            text-align: center;
        }

        .body-sub {
            margin-top: 25px;
            padding-top: 25px;
            border-top: 1px solid #EAEAEC;
        }

        .content-cell {
            padding: 45px;
        }

        /*Media Queries ------------------------------ */

        @media only screen and (max-width: 600px) {

            .email-body_inner,
            .email-footer {
                width: 100% !important;
            }
        }

        @media (prefers-color-scheme: dark) {

            body,
            .email-body,
            .email-body_inner,
            .email-content,
            .email-wrapper,
            .email-masthead,
            .email-footer {
                background-color: #333333 !important;
                color: #FFF !important;
            }

            p,
            ul,
            ol,
            blockquote,
            h1,
            h2,
            h3,
            span,
            .purchase_item {
                color: #FFF !important;
            }

            .attributes_content,
            .discount {
                background-color: #222 !important;
            }

            .email-masthead_name {
                text-shadow: none !important;
            }
        }

        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }
        .ii a[href]{
            color: #EAEAEC;
        }
    </style>
    <!--[if mso]>
    <style type="text/css">
      .f-fallback  {
        font-family: Arial, sans-serif;
      }
    </style>
  <![endif]-->
  
</head>

<body>
<span class="preheader">This is a receipt for your recent purchase at takeUforward store</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                        <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                            <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                role="presentation">
                                <!-- Body content -->
                                <tr>
                                    <td class="content-cell">
                                        <div class="f-fallback">
                                            <h1>Hi ${fullName},</h1>
                                            <p>Thank you for your support. It will help us grow more. </p>
                                            <p>The order is expected to be delivered in 7-10 working days.</p>
                                            <!-- Discount -->
                                            <table class="purchase" width="100%" cellpadding="0" cellspacing="0"
                                                role="presentation">
                                                <tr>
                                                    <td colspan="2">
                                                        <table class="purchase_content" width="100%" cellpadding="0"
                                                            cellspacing="0">
                                                            <tr>
                                                                <th class="purchase_heading" align="left">
                                                                    <p class="f-fallback">Description</p>
                                                                </th>
                                                                <th class="purchase_heading" align="right">
                                                                    <p class="f-fallback">Detail</p>
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                <td width="20%" class="purchase_item"><span
                                                                        class="f-fallback">GST Number</span></td>
                                                                <td class="align-right" width="80%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">19GWYPD1939M1ZJ</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_item"><span
                                                                        class="f-fallback">Transaction Id</span></td>
                                                                <td class="align-right" width="20%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">${newMerchantTransactionId}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_item"><span
                                                                        class="f-fallback">Tshirt Cost</span></td>
                                                                <td class="align-right" width="20%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">${paymentDetails.TshirtCost}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_item"><span
                                                                        class="f-fallback">Discount</span></td>
                                                                <td class="align-right" width="20%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">${paymentDetails.discount}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_item"><span
                                                                        class="f-fallback">Shipping</span></td>
                                                                <td class="align-right" width="20%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">${paymentDetails.Shipping}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_item"><span
                                                                        class="f-fallback">GST(5%)</span></td>
                                                                <td class="align-right" width="20%"
                                                                    class="purchase_item"><span
                                                                        class="f-fallback">${paymentDetails.GST}</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td width="80%" class="purchase_footer">
                                                                    <p
                                                                        class="f-fallback purchase_total purchase_total--label">
                                                                        Total</p>
                                                                </td>
                                                                <td width="20%" class="purchase_footer">
                                                                    <p class="f-fallback purchase_total--total">${paymentDetails.TotalAmount}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            <table class="body-action" align="center" width="100%" cellpadding="0"
                                                cellspacing="0" role="presentation">
                                                <tr>
                                                    <td align="center">
                                                        <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                                            role="presentation">
                                                            <tr style="display: flex; justify-content: center; align-items: center;">
                                                                <a href="https://merch.takeuforward.org/order"
                                                                    class="f-fallback button" target="_blank"
                                                                    style="font-family: Titillium Web;">Track
                                                                    Shipment</a>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            <p>If you have questions, please reply to this email.</p>
                                            <p>Have a great day. Keep striving! </p>
                                            <p>Cheers,
                                                <br>takeUforward
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
            `
        };
        await transporter.sendMail(message);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
}
exports.sendEmail = sendEmail;
