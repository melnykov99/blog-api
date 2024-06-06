import request from "supertest";
import app from "../../src/setting";
import {path} from "../datasets/e2e/paths";


describe("test", () => {
    it("should return 204 and delete all", async() => {
        await request(app)
            .delete(`${path.deleteData}`)
            .expect(204);
    });
});