const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    tournamentTitle: { type: String, required: [true, 'Tournament title is required'] },
    details: {
        type: String, required: [true, 'Details is required'],
        minLength: [10, 'the content should have at least 10 characters']
    },
    host: { type: String, required: [true, 'Host name is required'] },
    opponent: { type: String, required: [true, 'Opponent team name is required'] },
    matchType: { type: String, required: [true, 'Match Type is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    date: { type: Date, required: [true, 'date  is required'] },
    startTime: { type: String, required: [true, 'Start time is required'] },
    endTime: { type: String, required: [true, 'End time is required'] },
    team1LogoImage: { type: String, required: [true, 'Team1 Logo Image is required'] },
    team2LogoImage: { type: String, required: [true, 'Team2 Logo Image is required'] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
},
    { timestamps: true }
);

//collection name is stories in the database
module.exports = mongoose.model('schedule', newsSchema);

