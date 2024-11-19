import { DateUtils }from './dateUtils';

describe("DateUtils.formatDate function", () => {
    // Valid inputs
    test("formats a standard valid date", () => {
      expect(DateUtils.formatDate("19800101")).toBe("1980-01-01");
    });
  
    test("handles a date with a leading zero in the day", () => {
      expect(DateUtils.formatDate("19800102")).toBe("1980-01-02");
    });
  
    test("handles a date with a leading zero in the month", () => {
      expect(DateUtils.formatDate("19801101")).toBe("1980-11-01");
    });
  
    test("handles a date at the end of the year", () => {
      expect(DateUtils.formatDate("19801231")).toBe("1980-12-31");
    });
  
    test("handles a leap year date", () => {
      expect(DateUtils.formatDate("19800229")).toBe("1980-02-29");
    });
  
    test("handles the maximum valid date", () => {
      expect(DateUtils.formatDate("99991231")).toBe("9999-12-31");
    });
  
    test("handles the minimum valid date", () => {
      expect(DateUtils.formatDate("00010101")).toBe("0001-01-01");
    });
  
    // Invalid inputs
    test("throws an error for input shorter than 8 characters", () => {
      expect(() => DateUtils.formatDate("198001")).toThrow("Input must be an 8-character string in YYYYMMDD format.");
    });
  
    test("throws an error for input longer than 8 characters", () => {
      expect(() => DateUtils.formatDate("1980010112")).toThrow("Input must be an 8-character string in YYYYMMDD format.");
    });
  
    test("throws an error for input with non-numeric characters", () => {
      expect(() => DateUtils.formatDate("198001AB")).toThrow("Input must contain only numeric characters.");
    });
  
    test("throws an error for a nonexistent date (February 30)", () => {
      expect(() => DateUtils.formatDate("19800230")).toThrow("Day must be between 01 and 29 for the given month and year.");
    });
  
    test("throws an error for February 29 on a non-leap year", () => {
      expect(() => DateUtils.formatDate("19810229")).toThrow("Day must be between 01 and 28 for the given month and year.");
    });
  
    test("throws an error for a nonexistent month", () => {
      expect(() => DateUtils.formatDate("19801301")).toThrow("Month must be between 01 and 12.");
    });
  
    test("throws an error for all zeros as input", () => {
      expect(() => DateUtils.formatDate("00000000")).toThrow("Day must be between 01 and 31 for the given month and year.");
    });
  });