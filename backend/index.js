import express from 'express';
import cors from 'cors';
import { scrapeReviews } from './scraper';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
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