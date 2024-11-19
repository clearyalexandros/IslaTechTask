import { StringUtils }from './utils/stringUtils';
import { DateUtils }from './utils/dateUtils';

export function processInput(input: string) {
  // Parse the segments into a map
  const segments = StringUtils.parseSegments(input);

  // Extract and process the relevant segments
  const prsSegment = segments.get("PRS");
  const detSegment = segments.get("DET");

  if (!prsSegment || !detSegment) {
    throw new Error("Missing required segments (PRS or DET) in input.");
  }

  // Extract full name from PRS segment
  const prsFields = StringUtils.splitDataIntoArray(prsSegment); 
  const fullNameObject = StringUtils.parseFullName(prsFields[2]); // Extract the name field

  // Extract date of birth from PRS segment
  const formattedDob = DateUtils.formatDate(prsFields[4]); // Extract the date of birth field

  // Extract primary condition from DET segment
  const primaryCondition = StringUtils.extractLastText(detSegment);

  // Construct and return the final object
  return {
    fullName: fullNameObject.fullName,
    dateOfBirth: formattedDob,
    primaryCondition,
  };
}