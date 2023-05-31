const mongoose = require('mongoose')

const BabyName = mongoose.model("BabyName",{
    name:{
        type: String,
        trim: true,
        required: true
    }
}
)

module.exports = {BabyName}