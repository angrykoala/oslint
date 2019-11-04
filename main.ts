import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { generateMetrics, generateInsights } from './src/provider';

const app = express();
app.use(express.static(path.join(__dirname, "..", 'public')));

app.use(morgan(':method :url :status - :response-time ms'));

app.get("/api/metrics", async (req, res) => {
    try {
        const username = req.query.username;
        const repo = req.query.project;
        const metrics = await generateMetrics(username, repo);
        const insights = generateInsights(metrics);
        res.json({
            metrics,
            insights
        });
    } catch (err) {
        console.error(err.message || err);
        res.status(500).json({});

    }
});

app.get("*", (_req, res) => {
    res.sendFile("index.html", {
        root: path.join(__dirname, "..", 'public'),
    });
});

app.listen(3030, () => {
    console.log("Listening at 3030");
});
