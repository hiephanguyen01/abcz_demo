const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Doc not found!', 404));
    }
    res.status(201).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('doc not found!', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res) => {
    const data = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('doc not found!', 404));
    }
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(201).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
