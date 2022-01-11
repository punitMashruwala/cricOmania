const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    response: { type: String, required: [true, "Response Field is required"] },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emailId: { type: String, required: [true, "Email Id Field is required"] },
    scheduleId: { type: Schema.Types.ObjectId, ref: 'schedule', required:[true, "Schedule Id Field is required"] }
},
    { timestamps: true }
);

//collection name is stories in the database
module.exports = mongoose.model('rsvp', rsvpSchema);