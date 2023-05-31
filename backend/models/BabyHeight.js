const mongoose = require('mongoose')

const BabyHeight = mongoose.model("BabyHeight",{
    height:{
        type: Number,
        min: 0,
        max: 200,
        required: true
    },
    date:{
        type: Date
    }
})

module.exports = {BabyHeight}