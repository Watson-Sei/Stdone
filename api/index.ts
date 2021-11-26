import express from 'express';
import cors from 'cors';

const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}))

const route = require('./routes');
app.use('/', route)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})

