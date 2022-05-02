import { enumType } from "nexus";

export const voteOrderEnum = enumType({
    name: "voteOrder",
    members: {
        add: 1,
        delete: -1
    }
})