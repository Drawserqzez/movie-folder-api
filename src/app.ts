import express = require('express');
import validateJWT from './middleware/tokenAuth';

import { authRouter } from './routes/authRouter';
import { movieRouter } from './routes/movieRouter';
import { userRouter } from './routes/userRouter';

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(express.json());

// Routers
app.use('/auth/', authRouter);
app.use('/api/v1/movies/', validateJWT, movieRouter);
app.use('/api/v1/users/', validateJWT, userRouter);

app.get("/", (req, res) => {
    res.json({
        'message': 'Hello world! This is an API!'
    });
});

export default app;