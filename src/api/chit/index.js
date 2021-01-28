const response = require('../../helpers/response');

const { Chit } = require('../../models');

const { validate } = require('./service');

const fetchAll = async (req, res) => {
  const chits = await Chit.find({ accountId: req.account._id }).populate({
    path: 'memberId',
    model: 'Member',
    select: 'name'
  });
  res.status(200).json(response.success({ chits }));
};

const create = async (req, res) => {
  const { amount = null, date = null, receiver = null, memberId = null } = req.body;

  const createObject = { amount, date, receiver, memberId, accountId: req.account._id };

  await validate(createObject);

  let chit = await Chit.create(createObject);
  chit = await chit.populate({ path: 'memberId', model: 'Member', select: 'name' }).execPopulate();

  res.status(201).json(response.success({ chit }));
};

const destroy = async (req, res) => {
  const existingChit = await Chit.findOne({ _id: req.params.id });

  if (!existingChit) {
    let error = new Error('Chit not found');
    error.status = 404;
    throw error;
  }

  await Chit.deleteOne({ _id: req.params.id });
  res.status(200).json(response.success({ chitId: req.params.id }));
};

module.exports = { fetchAll, create, delete: destroy };
