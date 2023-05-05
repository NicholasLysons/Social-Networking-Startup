const { Schema, model } = require('mongoose');


const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    inPerson: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      // Sets a default value of 12 weeks from now
      default: () => new Date(+new Date() + 84 * 24 * 60 * 60 * 1000),
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

const User = model('user', userSchema);

modeule.exports = User;