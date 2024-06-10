import {deleteAllData} from "../utils/methods";
beforeEach(async() => {
    await deleteAllData();
});
afterAll(async() => {
    await deleteAllData();
});