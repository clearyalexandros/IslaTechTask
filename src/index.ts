export function formatDate(input: string): string {
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

interface FullName {
  lastName: string;
  firstName: string;
  middleName: string;  // Middle name is optional 
}

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


export function extractLastText(input: string): string {
  // Split the input string by the '|' delimiter
  const parts = input.split('|');

  // Extract the last element and sanitize it to allow only alphanumeric characters
  const lastPart = parts[parts.length - 1].trim();
  
  // Remove non-alphanumeric characters using a regular expression
  const sanitizedText = lastPart.replace(/[^a-zA-Z0-9\s]/g, ""); // Keeps letters, numbers, and spaces

  return sanitizedText;
}

export function parseSegments(input: string): Map <any,any> {
  // Initialize an empty map to store key-value pairs
  const segmentMap = new Map();

  // Split the input by newlines to process each line
  const lines = input.trim().split('\n');

  // Iterate through each line
  for (const line of lines) {
    // Split each line into the key and the rest of the data
    const [key, ...dataParts] = line.split('|');
    if (key) {
      // Reconstruct the value, including the first '|'
      segmentMap.set(key, `|${dataParts.join('|')}`);
    }
  }

  return segmentMap;
}