import { formatDate } from './index';
import { parseFullName } from './index';
import { extractLastText } from './index';
import { parseSegments } from './index';
import { splitDataIntoArray } from './index';

describe("formatDate function", () => {
  // Valid inputs
  test("formats a standard valid date", () => {
    expect(formatDate("19800101")).toBe("1980-01-01");
  });

  test("handles a date with a leading zero in the day", () => {
    expect(formatDate("19800102")).toBe("1980-01-02");
  });

  test("handles a date with a leading zero in the month", () => {
    expect(formatDate("19801101")).toBe("1980-11-01");
  });

  test("handles a date at the end of the year", () => {
    expect(formatDate("19801231")).toBe("1980-12-31");
  });

  test("handles a leap year date", () => {
    expect(formatDate("19800229")).toBe("1980-02-29");
  });

  test("handles the maximum valid date", () => {
    expect(formatDate("99991231")).toBe("9999-12-31");
  });

  test("handles the minimum valid date", () => {
    expect(formatDate("00010101")).toBe("0001-01-01");
  });

  // Invalid inputs
  test("throws an error for input shorter than 8 characters", () => {
    expect(() => formatDate("198001")).toThrow("Input must be an 8-character string in YYYYMMDD format.");
  });

  test("throws an error for input longer than 8 characters", () => {
    expect(() => formatDate("1980010112")).toThrow("Input must be an 8-character string in YYYYMMDD format.");
  });

  test("throws an error for input with non-numeric characters", () => {
    expect(() => formatDate("198001AB")).toThrow("Input must contain only numeric characters.");
  });

  test("throws an error for a nonexistent date (February 30)", () => {
    expect(() => formatDate("19800230")).toThrow("Day must be between 01 and 29 for the given month and year.");
  });

  test("throws an error for February 29 on a non-leap year", () => {
    expect(() => formatDate("19810229")).toThrow("Day must be between 01 and 28 for the given month and year.");
  });

  test("throws an error for a nonexistent month", () => {
    expect(() => formatDate("19801301")).toThrow("Month must be between 01 and 12.");
  });

  test("throws an error for all zeros as input", () => {
    expect(() => formatDate("00000000")).toThrow("Day must be between 01 and 31 for the given month and year.");
  });
});

describe('parseFullName function', () => {

  // Test case for valid input with all parts (lastName, firstName, middleName)
  test('should parse valid full name with middle name', () => {
    const input = "Smith^John^A";
    const expected = {
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: "A"
      }
    };
    expect(parseFullName(input)).toEqual(expected);
  });

  // Test case for valid input with missing middle name
  test('should parse valid full name without middle name', () => {
    const input = "Smith^John";
    const expected = {
      fullName: {
        lastName: "Smith",
        firstName: "John",
        middleName: ""
      }
    };
    expect(parseFullName(input)).toEqual(expected);
  });

  // Test case for invalid input with less than two parts
  test('should throw error when input has less than two parts', () => {
    const input = "Smith";
    expect(() => parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
  });

  // Test case for invalid input with more than three parts
  test('should throw error when input has more than three parts', () => {
    const input = "Smith^John^A^Extra";
    expect(() => parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
  });

  // Test case for invalid input with empty string
  test('should throw error when input is an empty string', () => {
    const input = "";
    expect(() => parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
  });

  // Test case for input with invalid characters (non-alphanumeric characters)
  test('should throw error when input has invalid characters', () => {
    const input = "Smith^John^@";
    expect(() => parseFullName(input)).toThrow("String contains non-alphabetical character: \"@\"");
  });

});


describe('extractLastText function', () => {
  test('should extract the last part of a valid input with alphanumeric characters', () => {
    const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Cold";
    expect(extractLastText(input)).toBe("Common Cold");
  });

  test('should remove special characters from the last part', () => {
    const input = "DET|123|Some Info|Final@Text&Here!";
    expect(extractLastText(input)).toBe("FinalTextHere");
  });

  test('should return the last part unchanged if it contains only alphanumeric characters and spaces', () => {
    const input = "A|B|Test Last Part";
    expect(extractLastText(input)).toBe("Test Last Part");
  });

  test('should return an empty string if the last part is non-alphanumeric', () => {
    const input = "A|B|###|||^^@!";
    expect(extractLastText(input)).toBe("");
  });

  test('should return an empty string for an empty input', () => {
    const input = "";
    expect(extractLastText(input)).toBe("");
  });

  test('should handle input with trailing delimiters', () => {
    const input = "A|B|C|";
    expect(extractLastText(input)).toBe("");
  });

  test('should handle input with no delimiters', () => {
    const input = "SinglePart";
    expect(extractLastText(input)).toBe("SinglePart");
  });

  test('should handle input with only delimiters', () => {
    const input = "|||||";
    expect(extractLastText(input)).toBe("");
  });

  test('should handle input with mixed alphanumeric and special characters in the last part', () => {
    const input = "1|2|3|Hello@123!";
    expect(extractLastText(input)).toBe("Hello123");
  });
});

describe('parseSegments function', () => {
  test('should parse a single segment correctly', () => {
    const input = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233";
    const result = parseSegments(input);
    expect(result.get("MSG")).toBe("|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233");
  });

  test('should parse multiple segments correctly', () => {
    const input = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|`;
    const result = parseSegments(input);
    expect(result.get("MSG")).toBe("|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233");
    expect(result.get("EVT")).toBe("|TYPE|20230502112233");
    expect(result.get("PRS")).toBe("|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|");
  });

  test('should retain the first "|" after the key', () => {
    const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Col";
    const result = parseSegments(input);
    expect(result.get("DET")).toBe("|1|I|^^MainDepartment^101^Room 1|Common Col");
  });

  test('should handle input with missing data after key', () => {
    const input = "EMPTY|";
    const result = parseSegments(input);
    expect(result.get("EMPTY")).toBe("|");
  });

  test('should handle input with empty lines', () => {
    const input = `
MSG|^~\\&|SenderSystem
EVT|TYPE|20230502112233

PRS|1|9876543210^^^Location^ID
`;
    const result = parseSegments(input);
    expect(result.get("MSG")).toBe("|^~\\&|SenderSystem");
    expect(result.get("EVT")).toBe("|TYPE|20230502112233");
    expect(result.get("PRS")).toBe("|1|9876543210^^^Location^ID");
  });

  test('should return an empty map for empty input', () => {
    const input = "";
    const result = parseSegments(input);
    expect(result.size).toBe(0);
  });

   test('should handle input with duplicate keys, keeping the last occurrence', () => {
    const input = `KEY|FirstValue
KEY|SecondValue`;
    const result = parseSegments(input);
    expect(result.get("KEY")).toBe("|SecondValue");
  });
});


describe('splitDataIntoArray function', () => {
  test('should split input into an array and remove empty strings', () => {
    const input = "|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|";
    const result = splitDataIntoArray(input);
    expect(result).toEqual([
      "1",
      "9876543210^^^Location^ID",
      "Smith^John^A",
      "M",
      "19800101"
    ]);
  });

  test('should handle input with only delimiters', () => {
    const input = "||||";
    const result = splitDataIntoArray(input);
    expect(result).toEqual([]);
  });

  test('should handle input with no delimiters', () => {
    const input = "NoDelimitersHere";
    const result = splitDataIntoArray(input);
    expect(result).toEqual(["NoDelimitersHere"]);
  });

  test('should handle input with leading and trailing delimiters only', () => {
    const input = "|";
    const result = splitDataIntoArray(input);
    expect(result).toEqual([]);
  });

  test('should handle input with multiple consecutive delimiters', () => {
    const input = "|A|||B||C|";
    const result = splitDataIntoArray(input);
    expect(result).toEqual(["A", "B", "C"]);
  });

  test('should handle empty input', () => {
    const input = "";
    const result = splitDataIntoArray(input);
    expect(result).toEqual([]);
  });

  test('should trim input before splitting if needed', () => {
    const input = "   |A|B|C|   ";
    const result = splitDataIntoArray(input.trim());
    expect(result).toEqual(["A", "B", "C"]);
  });

  test('should correctly split MSG input with multiple values and delimiters', () => {
    const input = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5";
    const result = splitDataIntoArray(input);
  
    expect(result).toEqual([
      "MSG",
      "^~\\&",
      "SenderSystem",
      "Location",
      "ReceiverSystem",
      "Location",
      "20230502112233",
      "DATA^TYPE",
      "123456",
      "P",
      "2.5"
    ]);
  });

  test('should correctly split EVT input with multiple values and delimiters', () => {
    const input = "EVT|TYPE|20230502112233";
    const result = splitDataIntoArray(input);
  
    expect(result).toEqual([
      "EVT",
      "TYPE",
      "20230502112233"
    ]);
  });
  
  test('should correctly split DET input with complex values and delimiters', () => {
    const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Cold";
    const result = splitDataIntoArray(input);
  
    expect(result).toEqual([
      "DET",
      "1",
      "I",
      "^^MainDepartment^101^Room 1",
      "Common Cold"
    ]);
  });
});