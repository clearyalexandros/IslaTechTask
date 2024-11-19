import {FullName} from '../interfaces/FullName'

export class StringUtils{
  // Parses a string input in the format lastName^firstName^middleName (where middleName is optional) and returns a FullName object.
  // Ensures all components of the name contain only alphabetical characters and validates the structure of the input.
 static parseFullName(input: string): { fullName: FullName } {
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
static extractLastText(input: string): string {
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
static parseSegments(input: string): Map <any,any> {
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
 static splitDataIntoArray(input: string): string[] {
  if (!input.trim()) {
    // Return an empty array for empty or whitespace-only input
    return [];
  }
  // Split the input string by '|' and filter out empty strings
  return input.split('|').filter(value => value !== "");
}
}