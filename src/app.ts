import express = require('express');
import { authRouter } from '../src/routes/auth';

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(express.json());

// Routers
app.use('/auth/', authRouter);

app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world!'
    });
});

export default app;