
import request from "supertest";

import server  from "./app";

describe("Test app.ts", () => {
    test("should return a valid result when valid data is sent to the end point", async () => {
    const expectedResponse = ({
        extractedData:{
        fullName: {
          lastName: "Cleary",
          firstName: "Alex",
          middleName: "C",
        },
        dateOfBirth: "1980-01-01",
        primaryCondition: "Common Cold",
      }});
      const res = (await request(server).post("/process-message").send({"message": "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233\nEVT|TYPE|20230502112233\nPRS|1|9876543210^^^Location^ID||Cleary^Alex^C|||M|19800101|\nDET|1|I|^^MainDepartment^101^Room 1|Common Cold"}));
      expect(res.body).toEqual(expectedResponse);
      expect(res.status).toEqual(200);
    });

    it('should return 400 if "message" is missing from the request body', async () => {
        const response = await request(server)
          .post('/process-message')
          .send({})
          .expect(400);
    
        expect(response.body).toEqual({
          error: "Invalid or missing 'message' in request body.",
        });
       });

    it('should return 400 if "message" is not a string', async () => {
    const response = await request(server)
        .post('/process-message')
        .send({ message: 12345 })
        .expect(400);

    expect(response.body).toEqual({
        error: "Invalid or missing 'message' in request body.",
    });
    });

     

    afterAll(() => {
        server.close(); // Close the server after all tests
      });
  });