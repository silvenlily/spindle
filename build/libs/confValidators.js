"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = exports.tokens = exports.config = void 0;
const tokens = {
    discord: "string",
    pg: "string",
};
exports.tokens = tokens;
const config = {
    prefix: "string",
};
exports.config = config;
const validators = { config, tokens };
exports.validators = validators;
exports.default = validators;
