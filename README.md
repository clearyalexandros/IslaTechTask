
# **Isla Technical Interview Task**

This project contains utility functions implemented in TypeScript, designed for processing and transforming structured data. Each function addresses a specific task and follows best practices for modularity, readability, and testing.

## **Project Setup**

### Prerequisites
- Node.js (v14 or above)
- TypeScript (v4 or above)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile TypeScript:
   ```bash
   npm run build
   ```

---

## **Utility Functions**

### **1. `formatDate`**
Converts a date string in `YYYYMMDD` format into a human-readable `YYYY-MM-DD` format.

#### **Signature**
```typescript
static formatDate(input: string): string;
```

#### **Example**
```typescript
const formattedDate = Utility.formatDate("19800101");
console.log(formattedDate); // "1980-01-01"
```

---

### **2. `parseFullName`**
Parses a name string in the format `lastName^firstName^middleName` into an object with `lastName`, `firstName`, and `middleName` fields.

#### **Signature**
```typescript
static parseFullName(input: string): { fullName: FullName };
```

#### **Example**
```typescript
const parsedName = Utility.parseFullName("Smith^John^A");
console.log(parsedName);
// {
//   fullName: {
//     lastName: "Smith",
//     firstName: "John",
//     middleName: "A"
//   }
// }
```

---

### **3. `extractLastText`**
Extracts and sanitizes the last segment of a pipe (`|`) delimited string, allowing only alphanumeric characters and spaces.

#### **Signature**
```typescript
static extractLastText(input: string): string;
```

#### **Example**
```typescript
const lastText = Utility.extractLastText("DET|1|I|^^MainDepartment^101^Room 1|Common Cold");
console.log(lastText); // "Common Cold"
```

---

### **4. `parseSegments`**
Splits a multi-line input string into key-value pairs, where each line's first segment serves as the key.

#### **Signature**
```typescript
static parseSegments(input: string): Map<string, string>;
```

#### **Example**
```typescript
const segments = Utility.parseSegments(`
MSG|^~\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233
EVT|TYPE|20230502112233
`);
console.log(segments.get("MSG"));
// "|^~\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233"
```

---

### **5. `splitDataIntoArray`**
Splits a pipe (`|`) delimited string into an array of values, omitting empty strings.

#### **Signature**
```typescript
static splitDataIntoArray(input: string): string[];
```

#### **Example**
```typescript
const dataArray = Utility.splitDataIntoArray("|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|");
console.log(dataArray);
// ["1", "9876543210^^^Location^ID", "Smith^John^A", "M", "19800101"]
```

---

### **6. `processInput`**
Processes a multi-line structured input, extracting key information such as full name, date of birth, and primary condition into an object.

#### **Signature**
```typescript
static processInput(input: string): {
  fullName: FullName;
  dateOfBirth: string;
  primaryCondition: string;
};
```

#### **Example**
```typescript
const result = Utility.processInput(`
MSG|^~\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
`);
console.log(result);
// {
//   fullName: {
//     lastName: "Smith",
//     firstName: "John",
//     middleName: "A"
//   },
//   dateOfBirth: "1980-01-01",
//   primaryCondition: "Common Cold"
// }
```

---

## **Testing**

Run the unit tests for the project using Jest:

1. Install Jest if not already installed:
   ```bash
   npm install --save-dev jest @types/jest ts-jest
   ```
2. Run the tests:
   ```bash
   npm test
   ```

---

## **Postman Collection**

A postman collection was added to the project to allow for easier testing of the endpoint