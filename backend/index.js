import express from 'express';
import cors from 'cors';
import {scrapeReviews} from './scraper.js';
import dotenv from 'dotenv';


const app = express();
const PORT = 3001;
dotenv.config();
console.log(process.env.BACKEND_URL);

app.use(cors());
app.use(express.json());

app.post(`${process.env.VITE_BACKEND_URL}/api/scrape`, async (req, res) => {
    const {url} = req.body;
    if (!url) return res.status(400).json({error: 'URL is required'});

    try {
        const reviews = await scrapeReviews(url);
        res.json({ reviews });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to scrape reviews' });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost: ${PORT}`);
})