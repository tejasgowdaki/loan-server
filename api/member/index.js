const response = require('../../helpers/response');

const { Member, Saving } = require('../../models');

const { validate } = require('./service');

const fetchAll = async (req, res) => {
  const members = await Member.find();
  res.status(200).json(response.success({ members }));
};

const create = async (req, res) => {
  const name = (req.body.name || '').trim();
  const mobile = (req.body.mobile || '').trim();

  await validate({ name, mobile });

  const member = await Member.create({ name, mobile });
  const saving = await Saving.create({
    memberId: member._id,
    totalSaving: 0,
    deposits: []
  });

  res.status(201).json(response.success({ member, saving }));
};

const update = async (req, res) => {
  const existingMember = await Member.findOne({ _id: req.params.id });

  if (!existingMember) {
    let error = new Error('Member not found');
    error.status = 404;
    throw error;
  }

  const name = (req.body.name || '').trim();
  const mobile = (req.body.mobile || '').trim();

  await validate({ name, mobile }, req.params.id);

  const member = await Member.findByIdAndUpdate(req.params.id, { name, mobile }, { new: true });

  res.status(200).json(response.success({ member }));
};

const destroy = async (req, res) => {
  const existingMember = await Member.findOne({ _id: req.params.id });

  if (!existingMember) {
    let error = new Error('Member not found');
    error.status = 404;
    throw error;
  }

  await Member.deleteOne({ _id: req.params.id });
  res.status(200).json(response.success({ memberId: req.params.id }));
};

module.exports = { fetchAll, create, update, delete: destroy };
