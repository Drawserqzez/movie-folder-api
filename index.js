const express = require('express');
const app = express();

app.get("/", (req, res) => {
    res.send("Hello there! <br> General Kenobi!");
});

app.get("/api/v1/", (req, res) => {
    res.json(JSON.stringify([1, 2, 3]));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}...`));