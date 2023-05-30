const mongoose = require('mongoose');

const Todo = mongoose.model("Todo", {
    text: {
        type: String,
        trim: true,
        required: true,
        completed: {
            type: Boolean,
            defaultValue: false,
        }
    }
})

module.exports = {Todo}