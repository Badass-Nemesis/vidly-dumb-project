const express = require('express');
const router = express.Router();
const Joi = require('Joi');

router.use(express.json());

const genres = [
    { id: 1, name: 'Horror' },
    { id: 2, name: 'Action' },
    { id: 3, name: 'Boring' },
];

validateGenre = (genre) => {
    // making a schema object for letting Joi know, that the name property of the object that 
    // we get, should be a string, minimum length should be 3, and it should be required
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    // returning the boolean value of object by comapring with schema object
    // return Joi.validate(genre, schema);
    return schema.validate(genre);
}

router.get('/', (req, res) => {
    // just normal output of all the genres
    res.send(genres);
});

router.get('/:id', (req, res) => {
    // this will store the whole genre's body of the given ID (if there is one)
    const genre = genres.find(c => c.id == parseInt(req.params.id));
    if (genre == null) {
        return res.status(404).send('The genre with this ID was not found');
    }

    // if found, just send the response
    res.send(genre);
});

router.post('/', (req, res) => {
    const { error, value } = validateGenre(req.body);
    if (error != null) {
        return res.status(404).send(error.details[0].message);
    }

    // making an object with the given res.body's name and just adding one more to id
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    // pushing the new object into genres list, and print the new object, bas aisehi.
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    // this will store the whole genre's body of the given ID (if there is one)
    const genre = genres.find(c => c.id == parseInt(req.params.id));
    if (genre == null) {
        return res.status(404).send('The genre with this ID was not found');
    }

    const { error } = validateGenre(req.body);
    if (error != null) {
        return res.status(400).send(error.details[0].message);
    }

    // updating the name of the given genre's id by given name, and print it once
    genre.name = req.body.name;
    res.send(genre);
});

router.delete('/:id', (req, res) => {
    const genre = genres.find(c => c.id == parseInt(req.params.id));
    if (genre == null) {
        return res.send(404).send('The genre with this ID was not found');
    }

    // storing the index of where we found the ID, and using splice to remove from list
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    // and just send the deleted item
    res.send(genre);
});

module.exports = router;