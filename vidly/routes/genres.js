const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('Joi');

router.use(express.json());

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    }
});

const Genre = mongoose.model('Genre', genreSchema);
// we could've written the whole new mongoose.schema instead of genreSchema here, but I like it that way

router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (genre == null) {
        return res.status(404).send('The genre with this ID was not found');
    }

    res.send(genre);
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(404).send(error.details[0].message);
    }

    let genre = new Genre({
        name: req.body.name
    });
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error != null) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) {
        return res.status(404).send('The genre with this ID was not found');
    }

    res.send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (genre == null) {
        return res.send(404).send('The genre with this ID was not found');
    }

    res.send(genre);
});

module.exports = router;