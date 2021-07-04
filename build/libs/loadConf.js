"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.loadConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const maxIterations = 10;
function getFile(path) {
    try {
        var raw = fs_1.default.readFileSync(path, "utf-8");
    }
    catch (error) {
        throw `Unable to read config file at path: ${path}\nerror:\n${error}`;
    }
    try {
        var file = JSON.parse(raw);
    }
    catch (error) {
        throw `Unable to parse config file at path: ${path}\nerror:\n${error}`;
    }
    return file;
}
exports.getFile = getFile;
function RecursivlyValidateConfig(config, validator, trace, currentIterations) {
    currentIterations++;
    let keys = Object.keys(validator);
    for (let i = 0; i < keys.length; i++) {
        if (typeof keys[i] == "object") {
            if (typeof config[keys[i]] == "object") {
                if (currentIterations <= maxIterations) {
                    RecursivlyValidateConfig(config[keys[i]], validator[keys[i]], `${trace}.${keys[i]}`, currentIterations);
                }
            }
            else {
                throw `Unable to validate config at: ${trace}.${keys[i]}, expected type: "object", got type: ${typeof config[keys[i]]}`;
            }
        }
        else {
            if (typeof config[keys[i]] !== validator[keys[i]]) {
                throw `Unable to validate config at: ${trace}.${keys[i]}, expected type: "${validator[keys[i]]}", got type: ${typeof config[keys[i]]}`;
            }
        }
    }
}
function loadConfig(path, validator) {
    const config = getFile(path);
    RecursivlyValidateConfig(config, validator, "", 0);
    return config;
}
exports.loadConfig = loadConfig;
exports.default = loadConfig;
