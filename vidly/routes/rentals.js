const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init("mongodb://0.0.0.0:27017/mongo-exercises");

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Movie.findById(req.params.customerID);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieID);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock == 0) return res.status(400).send('Movie not in Stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    /*
    when we are doing this in DB 

    rental = await rental.save();

    movie.numberInStock--;
    movie.save;

    res.send(rental);

    we could have an error in the rental.save and this would all stuck, if the customerid was not valid
    so we would require a transaction to happen, so that only if rental.save and movie-- is happening, then only we would consider
    it as done. otherwise we would throw an error 
    */

    try {
        await new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
            .run();

        res.send(rental);
    } catch (exc) {
        res.status(500).send('Something failed');
    }
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(400).send('The rental with the given ID was not found');

    res.send(rental);
});

module.exports = router;