import express from 'express';
import path from 'path';
import morgan from 'morgan';
import generateMetrics from './provider';

const app = express();
app.use(express.static(path.join(__dirname, "..", 'public')));

app.use(morgan(':method :url :status - :response-time ms'));

app.get("/api/metrics", async (req, res) => {
    const username = req.query.username;
    const repo = req.query.project;
    const result = await generateMetrics(username, repo);
    res.json(result);
});

app.get("*", (_req, res) => {
    res.sendFile("index.html", {
        root: path.join(__dirname, "..", 'public'),
    });
});

app.listen(3030, () => {
    console.log("Listening at 3030");
});
