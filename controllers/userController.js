const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const Users = await User.find();
      res.json(Users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getSingleUser(req, res) {
    try {
      const User = await User.findOne({ _id: req.params.UserId })
        .select('-__v');

      if (!User) {
        return res.status(404).json({ message: 'No User with that ID' });
      }

      res.json(User);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createUser(req, res) {
    try {
      const User = await User.create(req.body);
      res.json(User);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const User = await User.findOneAndDelete({ _id: req.params.UserId });

      if (!User) {
        res.status(404).json({ message: 'No User with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: User.Thoughts } });
      res.json({ message: 'User and Thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const User = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!User) {
        res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(User);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};