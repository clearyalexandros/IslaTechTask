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