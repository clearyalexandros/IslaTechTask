import { processInput } from './main';


describe('processInput function', () => {
  test('should process valid input and return the expected object', () => {
    const input = `
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    const result = processInput(input);

    expect(result).toEqual({
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A",
      },
      dateOfBirth: "1980-01-01",
      primaryCondition: "Common Cold",
    });
  });

  test('should throw an error if PRS segment is missing', () => {
    const input = `
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    expect(() => processInput(input)).toThrow(
      "Missing required segments (PRS or DET) in input."
    );
  });

  test('should throw an error if DET segment is missing', () => {
    const input = `
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    `;

    expect(() => processInput(input)).toThrow(
      "Missing required segments (PRS or DET) in input."
    );
  });

  test('should throw an error for invalid date format in PRS segment', () => {
    const input = `
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|1980ABCD|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    expect(() => processInput(input)).toThrow(
      "Input must contain only numeric characters."
    );
  });

  test('should throw an error for invalid name format in PRS segment', () => {
    const input = `
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^J@hn^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    expect(() => processInput(input)).toThrow(
      'String contains non-alphabetical character: "J@hn"'
    );
  });

  test('should handle input with extra whitespace correctly', () => {
    const input = `
    MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
    EVT|TYPE|20230502112233
    PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
    DET|1|I|^^MainDepartment^101^Room 1|Common Cold
    `;

    const result = processInput(input);

    expect(result).toEqual({
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A",
      },
      dateOfBirth: "1980-01-01",
      primaryCondition: "Common Cold",
    });
  });
});