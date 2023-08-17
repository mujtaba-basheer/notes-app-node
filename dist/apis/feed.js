"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYTFeed = void 0;
const dotenv_1 = require("dotenv");
const https = require("https");
const xml_js_1 = require("xml-js");
const app_error_1 = require("../utils/app-error");
const catch_async_1 = require("../utils/catch-async");
(0, dotenv_1.config)();
exports.getYTFeed = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        const { channel_id } = req.query;
        if (!channel_id)
            return next(new app_error_1.default("Invalid or missing params", 400));
        const request = https.request({
            method: "GET",
            host: "www.youtube.com",
            path: `/feeds/videos.xml?channel_id=${channel_id}`,
        }, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk.toString();
            });
            resp.on("error", (err) => {
                console.error(err);
                return next(new app_error_1.default(resp.statusMessage, resp.statusCode));
            });
            resp.on("end", () => {
                const { statusCode, statusMessage } = resp;
                if (statusCode === 200) {
                    const jsData = (0, xml_js_1.xml2js)(data, {
                        ignoreDeclaration: true,
                        // ignoreAttributes: true,
                    });
                    const sanitizedData = jsData.elements[0].elements
                        .filter((el) => el.name === "entry")
                        .map((entry) => {
                        for (const element of entry.elements) {
                            const { name } = element;
                            if (name === "yt:videoId") {
                                return element.elements[0].text;
                            }
                        }
                        return null;
                    });
                    return res.json({
                        status: true,
                        data: sanitizedData,
                    });
                }
                return next(new app_error_1.default(statusMessage, statusCode));
            });
        });
        request.on("error", (err) => {
            console.error(err);
            return next(new app_error_1.default("Failed to fetch resources", 500));
        });
        request.end();
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
