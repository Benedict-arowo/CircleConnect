"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSelectMinimized = exports.hash = exports.tokenGenerator = exports.verifyHash = void 0;
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const verifyHash = (hashedValue, unhashedValue) => __awaiter(void 0, void 0, void 0, function* () {
    return yield argon.verify(hashedValue, unhashedValue);
});
exports.verifyHash = verifyHash;
const tokenGenerator = (payload, expiresIn) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
});
exports.tokenGenerator = tokenGenerator;
const hash = (value) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedValue = yield argon.hash(value);
    return hashedValue;
});
exports.hash = hash;
exports.UserSelectMinimized = {
    email: true,
    id: true,
    profile_picture: true,
    first_name: true,
};
