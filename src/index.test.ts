import { formatDate } from './index';
import { parseFullName } from './index';


 
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

describe('parseFullName', () => {

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
