import express, { Request, Response } from "express";
import { processInput } from "./main"; // Adjust path if necessary

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

app.post('/process-message', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
     res.status(400).send({ error: "Invalid or missing 'message' in request body." });
  }

  try {
    const extractedData = processInput(message);
     res.status(200).send({ extractedData });
  } catch (error) {
     res.status(500).send({ error: (error as Error).message });
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});