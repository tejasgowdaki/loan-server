const response = require("../../helpers/response");

const { Member } = require("../../models");

const fetchAll = async (req, res) => {
  try {
    const members = await Member.find();

    res.status(200).json(response.success({ members }));
  } catch (error) {
    res.status(500).json(response.error());
  }
};

const create = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const mobile = req.body.mobile.trim();

    const member = await Member.create({ name, mobile });

    res.status(201).json(response.success({ member }));
  } catch (error) {
    res.status(500).json(response.error());
  }
};

const update = async (req, res) => {
  try {
    const name = req.body.name.trim();
    const mobile = req.body.mobile.trim();

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { name, mobile },
      { new: true, runValidators: true }
    );

    res.status(200).json(response.success({ member }));
  } catch (error) {
    res.status(500).json(response.error());
  }
};

const destroy = async (req, res) => {
  try {
    await Member.deleteOne({ _id: req.params.id });
    res.status(200).json(response.success({ memberId: req.params.id }));
  } catch (error) {
    res.status(500).json(response.error());
  }
};

module.exports = { fetchAll, create, update, delete: destroy };
