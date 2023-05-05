const { ObjectId } = require("mongoose").Types;
const { Thought, User } = require("../models");

const ThoughtCount = async () => {
  const numberOfThoughts = await Thought.aggregate().count("ThoughtCount");
  return numberOfThoughts;
};

const total = async (ThoughtId) =>
  Thought.aggregate([
    { $match: { _id: new ObjectId(ThoughtId) } },
    {
      $unwind: "$reactions",
    },
    {
      $group: {
        _id: new ObjectId(ThoughtId),
        Total: { $avg: "$reactions.total" },
      },
    },
  ]);

module.exports = {
  async getThoughts(req, res) {
    try {
      const Thoughts = await Thought.find();

      const ThoughtObj = {
        Thoughts,
        ThoughtCount: await ThoughtCount(),
      };

      res.json(ThoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const Thought = await Thought.findOne({
        _id: req.params.ThoughtId,
      }).select("-__v");

      if (!Thought) {
        return res.status(404).json({ message: "No Thought with that ID" });
      }

      res.json({
        Thought,
        total: await total(req.params.ThoughtId),
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
      const Thought = await Thought.findOneAndRemove({
        _id: req.params.ThoughtId,
      });

      if (!Thought) {
        return res.status(404).json({ message: "No such Thought exists" });
      }

      const User = await User.findOneAndUpdate(
        { Thoughts: req.params.ThoughtId },
        { $pull: { Thoughts: req.params.ThoughtId } },
        { new: true }
      );

      if (!User) {
        return res.status(404).json({
          message: "Thought deleted, but no Users found",
        });
      }

      res.json({ message: "Thought successfully deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    console.log("You are adding a reaction");
    console.log(req.body);

    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res
          .status(404)
          .json({ message: "No Thought found with that ID :(" });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const Thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $pull: { Reaction: { ReactionId: req.params.ReactionId } } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res
          .status(404)
          .json({ message: "No Thought found with that ID :(" });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
