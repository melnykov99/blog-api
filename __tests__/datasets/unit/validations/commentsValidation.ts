import {ErrorsMessages} from "../../../../src/libs/types/commonTypes";

const commentInvalidTypeData = {
    content: ['content'],
}
const commentEmptyData = {
    content: "",
}
const commentOnlySpaceData = {
    content: "   ",
}
const commentShortData = {
    content: "pgJlo9WRjRfJ0wCohR9\n"
}
const commentLongData = {
    content: "7nsUgBgEvXWjkRh607GaQMSWljrLPjBD06Wk0k7fiVABrV9onsrEOtuGKHFNtj05IY3GbUZ97BpT5een72prUOkOjj1TKZcNdAUyLV3o1HDlMM4o73VAIgC98AjEuGQNpPxNwNBifiRfUiH27paW2Fk5tWbnrh3BgitJfxdZ95hWWeYgLy37Vb0s5ueozjvYCo8z3urO0KFXeNnfsOg0nTNGoY45pJaLwqye8arYxejFxpMDoDSnhALLPY8twtfHXPcgu44NoTwG3TYZBFIfqEsHdFVDFj0qsZswCMrd9v1tN"
}
const commentValidData = {
    content: "Hello! This is my first comment for the post!",
}
const errorsMessages: ErrorsMessages = {
    errorsMessages: [
        {field: "content", message: "content must be string from 20 to 300 characters"},
    ],
};

export {commentInvalidTypeData, commentEmptyData, commentOnlySpaceData, commentShortData, commentLongData, commentValidData, errorsMessages}