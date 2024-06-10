import {ErrorsMessages} from "../../../../src/libs/types/commonTypes";

const blogInvalidTypeData = {
    name: ['name'],
    description: 123,
    websiteUrl: null,
}
const blogEmptyData = {
    name: "",
    description: "",
    websiteUrl: "",
}
const blogOnlySpaceData = {
    name: " ",
    description: "     ",
    websiteUrl: "           "
}
const blogLongData = {
    name: "u4XwVnY2VOMJpSht",
    description: "r9MBJHdmRsIJ6SXkhax4tdFY9LbNbIivB8AAktMtRCPgtGThd3HePabnk2CQ5QdDpJXtLUOIfAb4bIlk4cichKzEMj39T7Vqw16BKtAz7DHFq5Se49sHEzq0rtfSCI6yCyV7s1380JQqbrMqYgyg4xYgZbWSvfD70Y5PTUymCQUf62TT8N36YFoHU8O4U321nCP50ejOjQAapcPNZ1WyNCbuOIa6l5XCMD1Ljr7z9P5DwjHUS8fl8Ddm7PHHVweReqih2Pwk5ZAwToelbO6IyVdKTwajcqNOleQu4fhfMVdbtBo5T5GutrrujN97ZfwQFG2Ph5y2sHwFHrMEUDajeVnresk3rQrJNWjmjMpunAxrr9Xzcn6yRWkYoZjCQ7MRqTUsiz6zBFnfao2FZ9oPi4ltjrsgslOcE8mhE1dhcVBngZKCMYqkkuX7pvV8kxGhlzZvcUC6uCKs7mmryFztesjlcQQqW7FvY13PNKZ9cUha8hr0bJWUi",
    websiteUrl: "https://G3RoyL11gkJsTyvpEh43PO2DSS37ZXAFz9b1JbzEfQb4KfbPaMtV9HjAtIUfxPYxb1FqdYxxn6cSfbbgfRUkSOP6FsXspPcZWgq54AkK3BGQAu0BwmKkc5EH54Zecc7T12T5eQYqnL3u0DEuyfH1Uqfs45zf9yNzvHwwFn0Gc4crto4VA8blDxbbQykvNQ6WRUOYFYZNJnQrMVU4z8UHb8sVagNP6VQ7nfnXrSbQzDIheJRF9UhDHW1a6yocECm3QIUWGb1EIXc7tuxKKn9noEwQvBpISmZ4xJnf2MmzwLn7oIDJj9sMyC8g2Ah48QnLRDOmoT66XHzBY3cT5lrwT1P5UJxdTKzRA7pqccHdkWbfjkwVVtnCTFcFay7psIGKu1txj3cVEjswgeExV9dEnbugI6AJtnlcVo1qzSZr0W94v6K26OFOBBcYKJrcMikEvdOHaQUbsEvD9TejtAecZ2dtR5KnltgTrma6qN5TZ.com",
}
const blogInvalidWebsiteData = {
    name: "test name",
    description: "test description",
    websiteUrl: "googlecom",
}
const blogValidData = {
    name: "test name",
    description: "test description",
    websiteUrl: "https://google.com"
}
const allErrorsMessages: ErrorsMessages = {
    errorsMessages: [
        {field: "name", message: "name must be string with maximum length 15 characters"},
        {field: "description", message: "description must be string with maximum length 500 characters"},
        {field: "websiteUrl", message: "websiteUrl must be string with url format and maximum length 100 characters"},
    ],
};
const webSiteErrorMessage = {
    errorsMessages: [
        {field: "websiteUrl", message: "websiteUrl must be string with url format and maximum length 100 characters"}
    ]
}

export {blogInvalidTypeData, blogEmptyData, blogOnlySpaceData, blogLongData, blogInvalidWebsiteData, blogValidData, allErrorsMessages, webSiteErrorMessage}