const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // this is only written to supress a warning in mongoose 7 upgradation

mongoose.connect('mongodb://0.0.0.0:27017/mongo-exercises');

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: Date,
    isPublished: Boolean,
    price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    const courses = await Course
        // .find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
        .find({ isPublished: true })
        .or([
            { price: { $gte: 15 } },
            { name: /.*by.*/i } // writing 'i' after the pattern because we want out search to be case insensitive 
        ])
        // .sort({ price: -1 })
        .sort('-price') // price for ascending, -price for descending
        // .select({ name: 1, author: 1 });
        .select('name author price');
    return courses;// either return courses here, or direct return from above, by writing return await Course
}

async function run() {
    const courses = await getCourses();
    console.log(courses);
}

run();