import { StringUtils } from './stringUtils';
  
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
      expect(StringUtils.parseFullName(input)).toEqual(expected);
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
      expect(StringUtils.parseFullName(input)).toEqual(expected);
    });
  
    // Test case for invalid input with less than two parts
    test('should throw error when input has less than two parts', () => {
      const input = "Smith";
      expect(() => StringUtils.parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
    });
  
    // Test case for invalid input with more than three parts
    test('should throw error when input has more than three parts', () => {
      const input = "Smith^John^A^Extra";
      expect(() => StringUtils.parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
    });
  
    // Test case for invalid input with empty string
    test('should throw error when input is an empty string', () => {
      const input = "";
      expect(() => StringUtils.parseFullName(input)).toThrow("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
    });
  
    // Test case for input with invalid characters (non-alphanumeric characters)
    test('should throw error when input has invalid characters', () => {
      const input = "Smith^John^@";
      expect(() => StringUtils.parseFullName(input)).toThrow("String contains non-alphabetical character: \"@\"");
    });
  
  });
  
  
  describe('StringUtils.extractLastText function', () => {
    test('should extract the last part of a valid input with alphanumeric characters', () => {
      const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Cold";
      expect(StringUtils.extractLastText(input)).toBe("Common Cold");
    });
  
    test('should remove special characters from the last part', () => {
      const input = "DET|123|Some Info|Final@Text&Here!";
      expect(StringUtils.extractLastText(input)).toBe("FinalTextHere");
    });
  
    test('should return the last part unchanged if it contains only alphanumeric characters and spaces', () => {
      const input = "A|B|Test Last Part";
      expect(StringUtils.extractLastText(input)).toBe("Test Last Part");
    });
  
    test('should return an empty string if the last part is non-alphanumeric', () => {
      const input = "A|B|###|||^^@!";
      expect(StringUtils.extractLastText(input)).toBe("");
    });
  
    test('should return an empty string for an empty input', () => {
      const input = "";
      expect(StringUtils.extractLastText(input)).toBe("");
    });
  
    test('should handle input with trailing delimiters', () => {
      const input = "A|B|C|";
      expect(StringUtils.extractLastText(input)).toBe("");
    });
  
    test('should handle input with no delimiters', () => {
      const input = "SinglePart";
      expect(StringUtils.extractLastText(input)).toBe("SinglePart");
    });
  
    test('should handle input with only delimiters', () => {
      const input = "|||||";
      expect(StringUtils.extractLastText(input)).toBe("");
    });
  
    test('should handle input with mixed alphanumeric and special characters in the last part', () => {
      const input = "1|2|3|Hello@123!";
      expect(StringUtils.extractLastText(input)).toBe("Hello123");
    });
  });
  
  describe('StringUtils.parseSegments function', () => {
    test('should parse a single segment correctly', () => {
      const input = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233";
      const result = StringUtils.parseSegments(input);
      expect(result.get("MSG")).toBe("|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233");
    });
  
    test('should parse multiple segments correctly', () => {
      const input = `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
  EVT|TYPE|20230502112233
  PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|`;
      const result = StringUtils.parseSegments(input);
      expect(result.get("MSG")).toBe("|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233");
      expect(result.get("EVT")).toBe("|TYPE|20230502112233");
      expect(result.get("PRS")).toBe("|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|");
    });
  
    test('should retain the first "|" after the key', () => {
      const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Col";
      const result = StringUtils.parseSegments(input);
      expect(result.get("DET")).toBe("|1|I|^^MainDepartment^101^Room 1|Common Col");
    });
  
    test('should handle input with missing data after key', () => {
      const input = "EMPTY|";
      const result = StringUtils.parseSegments(input);
      expect(result.get("EMPTY")).toBe("|");
    });
  
    test('should handle input with empty lines', () => {
      const input = `
  MSG|^~\\&|SenderSystem
  EVT|TYPE|20230502112233
  
  PRS|1|9876543210^^^Location^ID
  `;
      const result = StringUtils.parseSegments(input);
      expect(result.get("MSG")).toBe("|^~\\&|SenderSystem");
      expect(result.get("EVT")).toBe("|TYPE|20230502112233");
      expect(result.get("PRS")).toBe("|1|9876543210^^^Location^ID");
    });
  
    test('should return an empty map for empty input', () => {
      const input = "";
      const result = StringUtils.parseSegments(input);
      expect(result.size).toBe(0);
    });
  
     test('should handle input with duplicate keys, keeping the last occurrence', () => {
      const input = `KEY|FirstValue
  KEY|SecondValue`;
      const result = StringUtils.parseSegments(input);
      expect(result.get("KEY")).toBe("|SecondValue");
    });
  });
  
  
  describe('StringUtils.splitDataIntoArray function', () => {
    test('should split input into an array and remove empty strings', () => {
      const input = "|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|";
      const result = StringUtils.splitDataIntoArray(input);
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
      const result = StringUtils.splitDataIntoArray(input);
      expect(result).toEqual([]);
    });
  
    test('should handle input with no delimiters', () => {
      const input = "NoDelimitersHere";
      expect(() => StringUtils.splitDataIntoArray(input)).toThrow("Input does not contain the required delimiter '|'");
    });
  
    test('should handle input with leading and trailing delimiters only', () => {
      const input = "|";
      const result = StringUtils.splitDataIntoArray(input);
      expect(result).toEqual([]);
    });
  
    test('should handle input with multiple consecutive delimiters', () => {
      const input = "|A|||B||C|";
      const result = StringUtils.splitDataIntoArray(input);
      expect(result).toEqual(["A", "B", "C"]);
    });
  
    test('should handle empty input', () => {
      const input = "";
      const result = StringUtils.splitDataIntoArray(input);
      expect(result).toEqual([]);
    });
  
    test('should trim input before splitting if needed', () => {
      const input = "   |A|B|C|   ";
      const result = StringUtils.splitDataIntoArray(input.trim());
      expect(result).toEqual(["A", "B", "C"]);
    });
  
    test('should correctly split MSG input with multiple values and delimiters', () => {
      const input = "MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5";
      const result = StringUtils.splitDataIntoArray(input);
    
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
      const result = StringUtils.splitDataIntoArray(input);
    
      expect(result).toEqual([
        "EVT",
        "TYPE",
        "20230502112233"
      ]);
    });
    
    test('should correctly split DET input with complex values and delimiters', () => {
      const input = "DET|1|I|^^MainDepartment^101^Room 1|Common Cold";
      const result = StringUtils.splitDataIntoArray(input);
    
      expect(result).toEqual([
        "DET",
        "1",
        "I",
        "^^MainDepartment^101^Room 1",
        "Common Cold"
      ]);
    });
  });
  
  describe('isStringValid function', () => {
    it('should return true for a non-empty string', () => {
      expect(StringUtils.isStringValid('hello')).toBe(true);
    });
  
    it('should return true for an empty string', () => {
      expect(StringUtils.isStringValid('')).toBe(true);
    });
  
    it('should return false for null', () => {
      expect(StringUtils.isStringValid(null as unknown as string)).toBe(false);
    });
  
    it('should return false for undefined', () => {
      expect(StringUtils.isStringValid(undefined as unknown as string)).toBe(false);
    });
  
    it('should return false for a number', () => {
      expect(StringUtils.isStringValid(123 as unknown as string)).toBe(false);
    });
  
    it('should return false for an object', () => {
      expect(StringUtils.isStringValid({} as string)).toBe(false);
    });
  
    it('should return false for an array', () => {
      expect(StringUtils.isStringValid([] as unknown as string)).toBe(false);
    });
  
    it('should return false for a boolean value', () => {
      expect(StringUtils.isStringValid(true as unknown as string)).toBe(false);
    });
  });