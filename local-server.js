import express from 'express';
import cors from 'cors';import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 4202;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'models' directory
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
