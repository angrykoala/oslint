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
    let username: string = "";
    let repo: string = "";
    try {
        username = req.query.username;
        repo = req.query.project;
        const metrics = await generateMetrics(username, repo);
        console.log(`[${username}/${repo}] Metrics ready.`);
        const insights = generateInsights(metrics);
        console.log(`[${username}/${repo}] Insights ready. Total: ${insights.length}`);
        res.json({
            metrics,
            insights
        });
    } catch (err) {
        console.error("\x1b[31m%s\x1b[0m", `[${username}/${repo}] ${err.message || err}`);
        res.status(500).json({});

    }
});

app.get("/api/*", (_req, res) => {
    res.status(400).send();
});

app.get("*", (_req, res) => {
    res.sendFile("index.html", {
        root: path.join(__dirname, "..", 'public'),
    });
});

app.listen(3030, () => {
    console.log("Listening at 3030");
});
