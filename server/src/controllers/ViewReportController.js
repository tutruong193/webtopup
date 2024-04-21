const ViewReportService = require("../services/ViewReportService");
const updateView = async (req, res) => {
  try {
    const { facultyId, eventId, selected } = req.body;
    if (!facultyId || !selected || !eventId) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ViewReportService.updateView(facultyId,eventId, selected);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
const getseletedView = async (req, res) => {
  try {
    const { facultyId,eventId } = req.query;
    if (!facultyId || !eventId ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await ViewReportService.getseletedView(facultyId,eventId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  updateView,
  getseletedView,
};
