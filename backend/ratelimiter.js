import rateLimit from "express-rate-limit";

const authlimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {message: "Too many requests, Try again later."}
});

const createbloglimit = rateLimit({
    windowMs: 30 * 1000,
    limit: 10,
    message: {message: "Too many requests, Try again later."}
});

const readbloglimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {message: "Too many requests, Try again later."}
});

export {authlimit , createbloglimit , readbloglimit };