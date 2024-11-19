import * as utils from './utils/helperFunctions';

export function processInput(input: string) {
  // Parse the segments into a map
  const segments = utils.parseSegments(input);

  // Extract and process the relevant segments
  const prsSegment = segments.get("PRS");
  const detSegment = segments.get("DET");

  if (!prsSegment || !detSegment) {
    throw new Error("Missing required segments (PRS or DET) in input.");
  }

  // Extract full name from PRS segment
  const prsFields = utils.splitDataIntoArray(prsSegment); 
  const fullNameObject = utils.parseFullName(prsFields[2]); // Extract the name field

  // Extract date of birth from PRS segment
  const formattedDob = utils.formatDate(prsFields[4]); // Extract the date of birth field

  // Extract primary condition from DET segment
  const primaryCondition = utils.extractLastText(detSegment);

  // Construct and return the final object
  return {
    fullName: fullNameObject.fullName,
    dateOfBirth: formattedDob,
    primaryCondition,
  };
}