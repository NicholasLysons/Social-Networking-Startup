const { Schema, model } = require('mongoose');


const userSchema = new Schema(
  {
    userName: {
      type: String,
      id:'Luke Skywalker',
      required: true,
    },
    email: {
      type: String,
      id:'galaxysavior@hotmail.com',
      required: true,
    },
    thoughts: {
      type: Date,
      default: Date.now(),
    },
    
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'email',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const User = model('User', UserSchema);

modeule.exports = User;