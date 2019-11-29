const mongoose = require('mongoose');

const GeolocationSchema = new mongoose.Schema({
    user_id: {
        type: int,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

const Geolocation = mongoose.model('Geolocation', GeolocationSchema);

module.exports = Geolocation;