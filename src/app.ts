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

app.get("/birthday/", (req, res) => {
    res.send('Grattis på födelsedagen! Den här tjänsten är grunden för ett digitaliserat system för pärmarna som jag har jobbat på det senaste. Det är inte riktigt klart än, men du kan nog vänta dig att allting är i sin ordning innan mars.\nKram <3 Algot');
});

export default app;