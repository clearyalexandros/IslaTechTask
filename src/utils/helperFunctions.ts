// formatDate() takes a date string in the YYYYMMDD format and returns it in the YYYY-MM-DD format.
// It validates the input for the correct length, ensures it contains only numeric characters, and checks that the year, month, and day values are valid. 
// If any validation fails, it throws an appropriate error.
export  function formatDate(input: string): string {
    // Validate input length
  if (typeof input !== "string" || input.length !== 8) {
    throw new Error("Input must be an 8-character string in YYYYMMDD format.");
  }

  // Validate input is numeric
  if (!/^\d{8}$/.test(input)) {
    throw new Error("Input must contain only numeric characters.");
  }

  // Extract year, month, and day
  const year = parseInt(input.slice(0, 4), 10);
  const month = parseInt(input.slice(4, 6), 10);
  const day = parseInt(input.slice(6, 8), 10);

   // Validate day range
   const daysInMonth = new Date(year, month, 0).getDate();
   if (day < 1 || day > daysInMonth) {
     throw new Error(`Day must be between 01 and ${daysInMonth} for the given month and year.`);
   }
 
  // Validate month range
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 01 and 12.");
  }
 
  // Format the date as YYYY-MM-DD
  const formattedDate = `${year.toString().padStart(4, "0")}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  return formattedDate;
}

// Parses a string input in the format lastName^firstName^middleName (where middleName is optional) and returns a FullName object.
// Ensures all components of the name contain only alphabetical characters and validates the structure of the input.
export function parseFullName(input: string): { fullName: FullName } {
  const nameParts = input.split('^');

  // Ensure there are at least two parts (lastName, firstName) and optionally a middleName
  if (nameParts.length < 2 || nameParts.length > 3) {
    throw new Error("Input must be in the format 'lastName^firstName^middleName' (middleName is optional).");
  }

  const regex = /[^a-zA-Z]/; // Regular expression to match any non-alphabetical character

  for (const str of nameParts) {
    if (regex.test(str)) {
      throw new Error(`String contains non-alphabetical character: "${str}"`);
    }
  }

  // If middle name is not provided make sure we set it as a blank string otherwise it will be added as 'undefined'and cause issues
  if( nameParts.length == 2){
    nameParts.push("");
  }

  const [lastName, firstName, middleName] = nameParts;

  // Return the full name object, middleName is optional
  return {
    fullName: {
      lastName,
      firstName,
      middleName
    }
  };
}

// Extracts the last segment of a pipe-delimited (|) string, 
// sanitizes it to remove non-alphanumeric characters (excluding spaces), and returns the cleaned result.
export function extractLastText(input: string): string {
  // Split the input string by the '|' delimiter
  const parts = input.split('|');

  // Extract the last element and sanitize it to allow only alphanumeric characters
  const lastPart = parts[parts.length - 1].trim();
  
  // Remove non-alphanumeric characters using a regular expression
  const sanitizedText = lastPart.replace(/[^a-zA-Z0-9\s]/g, ""); // Keeps letters, numbers, and spaces

  return sanitizedText;
}

// Parses a string containing multiple segments separated by newlines (\n) and pipes (|), 
// and returns a Map where each key-value pair corresponds to a segment's identifier and its associated data. 
// The function also ensures leading spaces are removed from each line and skips empty lines.
export function parseSegments(input: string): Map <any,any> {
  // Initialize an empty map to store key-value pairs
  const segmentMap = new Map();

  // Split the input by newlines to process each line
  const lines = input.trim().split('\n');

  // Iterate through each line
  for (let line of lines) {
    // Skip empty lines after trimming
    if (!line) continue;

    // trim any leading spaces at the beginning of the line
    line = line.trimStart();

    // Split each line into the key and the rest of the data
    const [key, ...dataParts] = line.split('|');
    if (key) {
      // Reconstruct the value, including the first '|'
      segmentMap.set(key, `|${dataParts.join('|')}`);
    }
  }

  return segmentMap;
}

// Splits a string into an array of substrings based on the pipe (|) delimiter. If the input string is empty or contains only whitespace, it returns an empty array. 
// The function also filters out any empty strings resulting from consecutive delimiters or leading/trailing delimiters.
export function splitDataIntoArray(input: string): string[] {
  if (!input.trim()) {
    // Return an empty array for empty or whitespace-only input
    return [];
  }
  // Split the input string by '|' and filter out empty strings
  return input.split('|').filter(value => value !== "");
}
