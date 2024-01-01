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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotificationStatus = exports.sendNotification = void 0;
const db_1 = __importDefault(require("../model/db"));
const sendNotification = (props) => __awaiter(void 0, void 0, void 0, function* () {
    if (props.many) {
        const data = Array.isArray(props.data) ? props.data : [props.data];
        const newNotifications = yield db_1.default.notification.createMany({
            skipDuplicates: true,
            data: data.map((notificationData) => ({
                content: notificationData.content,
                userId: notificationData.userId,
            })),
        });
        return newNotifications;
    }
    else if ("content" in props.data && "userId" in props.data) {
        const newNotification = yield db_1.default.notification.create({
            data: {
                content: props.data.content,
                userId: props.data.userId,
            },
        });
        return newNotification;
    }
});
exports.sendNotification = sendNotification;
const updateNotificationStatus = (props) => __awaiter(void 0, void 0, void 0, function* () {
    const notification = yield db_1.default.notification.update({
        where: {
            id: props.id,
        },
        data: {
            status: props.status,
        },
    });
    return notification;
});
exports.updateNotificationStatus = updateNotificationStatus;
