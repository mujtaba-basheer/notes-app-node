"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleTopic = void 0;
const dotenv_1 = require("dotenv");
const app_error_1 = require("../utils/app-error");
const catch_async_1 = require("../utils/catch-async");
const db_1 = require("../db");
(0, dotenv_1.config)();
exports.getSingleTopic = (0, catch_async_1.default)(async (req, res, next) => {
    try {
        let qs = "";
        const { topicName } = req.query;
        let isLoggedIn = false;
        if (req.user) {
            const email = req.user.email;
            isLoggedIn = true;
            let newQs = "";
            // Get query for Logged In user
            qs = loadLoggedInQuery(email, topicName, newQs);
        }
        else {
            let newQs = "";
            // Get query 
            qs = loadQuery(topicName, newQs);
        }
        db_1.default.query(qs, (err, results, fields) => {
            if (err)
                return next(new app_error_1.default(err.message, 403));
            let current_day = -1; // current day
            const days = [];
            for (let i = 0; i < results.length; i++) {
                const topic = results[i];
                const { step_no, head_step_no, day_description } = topic;
                if (step_no - 1 > current_day) {
                    days.push({
                        sl_no: step_no,
                        title: head_step_no,
                        description: day_description,
                        topics: [],
                    });
                    current_day++;
                }
                try {
                    days[current_day].topics.push(topic);
                }
                catch (error) {
                    console.error(error);
                }
            }
            res.status(200).json({
                status: true,
                data: days,
                credentials: isLoggedIn,
            });
        });
    }
    catch (error) {
        return next(new app_error_1.default(error.message, error.statusCode || 501));
    }
});
function loadLoggedInQuery(email, topicName, newQs) {
    newQs = `
        SELECT
            t.id,
            t.tags,
            t.title,
            t.yt_link,
            t.post_link,
            d.sl_no_in_step,
            n.text as note,
            p.progress as status,
            d.head_step_no as head_step_no,
            d.step_no as step_no,
            t.cs_link as p1_link,
            t.lc_link as p2_link
        FROM (
            topics as t
            INNER JOIN ${topicName} as d ON (t.id COLLATE utf8mb4_unicode_ci) = (d.id COLLATE utf8mb4_unicode_ci)
        )
        LEFT JOIN (progress as p) ON (
            p.email = "${email}"
            AND p.q_id = t.id
        )
        LEFT JOIN (notes as n) ON (
            n.email = "${email}"
            AND n.q_id = t.id
        )
        
        ORDER BY
            d.step_no,
            d.sl_no_in_step;
        `;
    return newQs;
}
function loadQuery(topicName, newQs) {
    newQs = `
    SELECT
        t.id,
        t.tags,
        t.title,
        t.yt_link,
        t.post_link,
        t.lc_link as p2_link,
        d.head_step_no as head_step_no,
        d.step_no as step_no,
        d.sl_no_in_step as sl_no_in_step,
        t.cs_link as p1_link,
        t.lc_link as p2_link
    FROM
        topics as t
    INNER JOIN ${topicName} as d ON (t.id COLLATE utf8mb4_unicode_ci) = (d.id COLLATE utf8mb4_unicode_ci)
    ORDER BY
        d.step_no,
        d.sl_no_in_step;
        `;
    return newQs;
}
