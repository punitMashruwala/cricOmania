const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: [true, 'title is required'] },
    content: { type: String, required: [true, 'content is required'] },
    author: { type: String, required: [true, 'author name is required'] },
    category: { type: String, required: [true, 'category is required'] },
    date: { type: Date, required: [true, 'date  is required'] },
    time: { type: String, required: [true, 'time is required'] },
    image: { type: String, required: [true, 'image is required'] },
    createdBy: { type: String }
},
    { timestamps: true }
);

//collection name is stories in the database
module.exports = mongoose.model('news', newsSchema);

