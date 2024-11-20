
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

---

## **Future Work**

### **1. `Architecture`** 

This project could  be expanded using a layered architecture which ensures clear separation of concerns:

Presentation Layer (API): Handles HTTP requests and responses, communicates with clients.
Business Logic Layer (Service): Contains the core logic like data parsing, validation, and transformations.
Data Access Layer (Repository): Interacts with the database, performing CRUD operations.

An example of the layout of the project can be found below:
```bash
src/
│
├── controllers/    # API endpoints
│   └── messageController.ts
│
├── services/       # Business logic
│   └── messageService.ts
│
├── repositories/   # Database access logic
│   └── messageRepository.ts
│
├── models/         # Database models and interfaces
│   └── message.ts
│
├── utils/          # Shared utilities (e.g., logging, validation)
│   └── logger.ts
│   └── validation.ts
│
├── middlewares/    # Error handling, authentication, request validation
│   └── errorHandler.ts
│
├── config/         # Configuration files (e.g., environment variables)
│   └── dbConfig.ts
│
├── routes/         # API routes
│   └── messageRoutes.ts
│
└── app.ts          # Application entry point
```

### **2. `Modularity and Maintainability`** 

Core Business Logic: Encapsulated in the services/ layer, making it reusable across APIs or other systems.
Shared Utilities: Centralize reusable functions like logging, validation, and error formatting in the utils/ directory.
Dependency Injection: Use DI for repositories and services to make components easily testable and replaceable.

### **3. `Database design`** 

I would use a relational database (e.g., PostgreSQL)  for storing the data. Given that I would be working with sensitive patient data
certain considerations would have to be taken into mind. As a first step I would use base64 encryption for encoding for data representation,
 ensuring that binary data is safely transmitted or stored in systems that handle text-only formats. 
 Furthermore, I would use AES (Advanced Encryption Standard) or another robust encryption method to encrypt sensitive data before encoding it in Base64.

 Here is an example of the table schema for storing the data processed by the Application
 ```bash
 CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  full_name JSONB NOT NULL,         -- Stores parsed full name as JSON
  date_of_birth DATE NOT NULL,
  primary_condition TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```
### **4. `Logging and Error handling`** 
I would log all significant events (e.g., request received, processing completed, errors).
I would us=se centralized middleware to handle errors and format consistent error responses.

### **5. `Scalability`** 
I would implement scalable API Design using Restful endpoints and break them down to modular resources and keep them organized to their primaric focus.
For high-throughput parsing or storage, I would use message queues like RabbitMQ.
Lastly, I would ensure that user authentication was implemented for accessing endpoints in a secure manner.
