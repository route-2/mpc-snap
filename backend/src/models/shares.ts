import mongoose from "mongoose"
const {Schema} = mongoose

const ShareSchema = new Schema({
    address: {
        type: String,
    },
    share: {
        type: String,
        required: [true, 'field is required']
    },
});


const Share = mongoose.model('share',ShareSchema);

module.exports = Share;

