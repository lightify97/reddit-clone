"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginResponse = exports.errorType = void 0;
const nexus_1 = require("nexus");
exports.errorType = (0, nexus_1.objectType)({
    name: "Error",
    definition(type) {
        type.nullable.string('field');
        type.nonNull.string('message');
    }
});
exports.loginResponse = (0, nexus_1.objectType)({
    name: "UserResponse",
    definition(type) {
        type.nullable.field('user', { type: "User" });
        type.nullable.list.field('errors', { type: "Error" });
    }
});
//# sourceMappingURL=UserResponse.js.map