import express = require('express');
import { authRouter } from './routes/auth';
import validateJWT from './middleware/tokenAuth';

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

app.get("/api/test/", validateJWT, (req, res) => {
    res.json({
        'message': 'You are validated! Well done you!!'
    });
});

export default app;