const classService = require("../services/classService");
const { success } = require("../utils/response");
const {
  scheduleIdParam,
  seatUpdateRequest,
} = require("../validators/requestValidators");

const listClasses = async (req, res) => {
  const classes = await classService.listClasses(req.user.id);
  return success(res, classes);
};

const updateSeat = async (req, res) => {
  const { name, scheduleId, seatId } = seatUpdateRequest({
    body: req.body,
    params: req.params,
  });

  const result = await classService.updateSeat({
    scheduleId,
    seatId,
    name,
    userId: req.user.id,
  });

  return success(res, result.data, {
    message: result.message,
  });
};

const getSeats = async (req, res) => {
  const { scheduleId } = scheduleIdParam(req.params);
  const seats = await classService.getSeats({
    scheduleId,
    userId: req.user.id,
  });

  return success(res, seats);
};

module.exports = {
  getSeats,
  listClasses,
  updateSeat,
};
