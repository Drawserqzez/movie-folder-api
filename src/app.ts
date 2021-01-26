import express = require('express');
import { authRouter } from './routes/auth';

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(express.json());

// Routers
app.use('/auth/', authRouter);

app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world! This is an API!'
    });
});

export default app;