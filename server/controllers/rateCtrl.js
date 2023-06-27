const Rate = require("../models/ratingModel");

const rateCtrl = {
  createRating: async (req, res) => {
    try {
      const { value, comment } = req.body;
      if (!value) return res.status(400).json({ msg: "Rating required" });
      await Rate.create({
        user: req.user._id,
        value,
        comment,
      });
      res.status(200).json({ msg: "Success" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getRating: async (req, res) => {
    try {
      const rates = await Rate.find()
        .populate("user", "username avatar")
        .sort({ value: -1 });
      res.status(200).json(rates);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = rateCtrl;
