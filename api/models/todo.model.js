'use strict'
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statusSchema = new Schema({
    label: String,
    priority: {
        type: Number,
        required: 'Status always should have a number'
    }
});

var prioritySchema = new Schema({
    label: String,
    priority: {
        type: Number,
        required: 'Priority should always have a number'
    }
});


var TodoSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: "Title can't be blank"
    },
    comment: {
        type: String,
        default: '',
        trim: true
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User',
        required: "Todo must always have a creator"
    },
    tag: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    status: {
        type: statusSchema
    },
    priority: {
        type: prioritySchema
    }
});
mongoose.model('Todo', TodoSchema);
