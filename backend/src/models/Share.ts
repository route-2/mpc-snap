import mongoose from "mongoose"
const {Schema} = mongoose

const Share = new Schema({
    address: {
        type: String,
    },
    share: {
        type: String,
        required: [true, 'field is required']
    },
});


export const ShareModel = mongoose.model('Share',Share);


module.exports = ShareModel;

