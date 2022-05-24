"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const nexus_1 = require("nexus");
const path_1 = require("path");
const types = __importStar(require("./graphql"));
const nexus_validate_1 = require("nexus-validate");
exports.schema = (0, nexus_1.makeSchema)({
    types,
    plugins: [(0, nexus_validate_1.validatePlugin)(), (0, nexus_1.fieldAuthorizePlugin)()],
    outputs: {
        typegen: (0, path_1.join)(process.cwd(), "node_modules", "@types", "nexus-typegen", "index.d.ts"),
        schema: (0, path_1.join)(process.cwd(), "src", "graphql", "schema.graphql"),
    },
    contextType: {
        export: "Context",
        module: (0, path_1.join)(process.cwd(), "./src/context.ts"),
    },
});
//# sourceMappingURL=schema.js.map