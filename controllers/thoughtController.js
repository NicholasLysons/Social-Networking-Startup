const { ObjectId } = require('mongoose').Types;
const { Thought, User} = require('../models');

const ReactionCount = async () => {
  const numberOfThoughts = await Reaction.aggregate()
    .count('ThoughtCount');
  return numberOfThoughts;
}

const Reaction = async (UserId) =>
  Reaction.aggregate([
  
    { $match: { _id: new ObjectId(UserId) } },
    {
      $unwind: '$reactions',
    },
    {
      $group: {
        _id: new ObjectId(UserId),
        ReactionTotal: { $avg: '$reactions' },
      },
    },
  ]);

module.exports = {

  async getThoughts(req, res) {
    try {
      const User = await User.find();

      const ThoughtObj = {
        students,
        userCount: await ReactionCount(),
      };

      res.json(ThoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  
  async getSingleThought(req, res) {
    try {
      const Thought = await User.findOne({ _id: req.params.ThoughtId })
        .select('-__v');

      if (!Thought) {
        return res.status(404).json({ message: 'No Thought with that ID' })
      }

      res.json({
        Thought,
        grade: await grade(req.params.studentId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const Thought = await Thought.create(req.body);
      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  
  async deleteThought(req, res) {
    try {
      const Thought = await Thought.findOneAndRemove({ _id: req.params.ThoughtId });

      if (!Thought) {
        return res.status(404).json({ message: 'No such Thought exists' });
      }

      const course = await Course.findOneAndUpdate(
        { students: req.params.studentId },
        { $pull: { students: req.params.studentId } },
        { new: true }
      );

      if (!course) {
        return res.status(404).json({
          message: 'Student deleted, but no courses found',
        });
      }

      res.json({ message: 'Student successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },


  async reaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);

    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $addToSet: { reaction: req.body } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res
          .status(404)
          .json({ message: 'No Thought found with that ID :(' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeThought(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $pull: { assignment: { assignmentId: req.params.ThoughtId } } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res
          .status(404)
          .json({ message: 'No Thought found with that ID :(' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};