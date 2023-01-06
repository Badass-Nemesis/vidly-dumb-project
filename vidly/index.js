const mongoose = require('mongoose');
const Joi = require('Joi');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const express = require('express');
const app = express();

mongoose.set('strictQuery', true); // this is only written to supress a warning in mongoose 7 upgradation
mongoose.connect('mongodb://0.0.0.0:27017/mongo-exercises')
    .then(() => console.log('Connected to MongoDB ....'))
    .catch(err => console.error('Could not connect to MongoDB ....'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}......`));