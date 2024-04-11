const ContributionService = require("../services/ContributionService");

const createContribution = async (req, res) => {
  try {
    const {
      studentId,
      title,
      submission_date,
      lastupdated_date,
      eventId,
      facultyId,
      status,
      content,
      nameofword,
      imageFiles,
    } = req.body;
    if (
      !studentId ||
      !title ||
      !submission_date ||
      !lastupdated_date ||
      !eventId ||
      !facultyId ||
      !status ||
      !content ||
      !nameofword
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Incomplete input data",
      });
    }
    const nameofworddb = process.env.FILENAME;
    const response = await ContributionService.createContribution({
      studentId,
      content,
      nameofword,
      title,
      submission_date,
      lastupdated_date,
      eventId,
      facultyId,
      status,
      imageFiles,
      nameofworddb,
    });
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getDetailContribution = async (req, res) => {
  try {
    const contributionId = req.params.id;
    if (!contributionId) {
      return res.status(400).json({
        status: "ERR",
        message: "Incomplete input data",
      });
    }
    const response = await ContributionService.getDetailContribution(
      contributionId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getContributionSubmited = async (req, res) => {
  try {
    const studentId = req.params.id;
    if (!studentId) {
      return res.status(400).json({
        status: "ERR",
        message: "Incomplete input data",
      });
    }
    const response = await ContributionService.getContributionSubmited(
      studentId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const deleteContribution = async (req, res) => {
  try {
    const contributionId = req.params.id;
    if (!contributionId) {
      return res.status(400).json({
        status: "ERR",
        message: "Contribution not found",
      });
    }
    const response = await ContributionService.deleteContribution(
      contributionId
    );
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const updateContribution = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The ContributionID is required",
      });
    }
    const response = await ContributionService.updateContribution(id, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllContributions = async (req, res) => {
  try {
    const response = await ContributionService.getAllContributions();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateCommentContribution = async (req, res) => {
  try {
    const id = req.params.id;
    const { comment } = req.body;
    if (!id) {
      return res.status(200).json({
        status: "ERR",
        message: "The ContributionID is required",
      });
    }
    if (!comment) {
      return res.status(200).json({
        status: "ERR",
        message: "The comment is required",
      });
    }
    const response = await ContributionService.updateCommentContribution(
      id,
      comment
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createContribution,
  getContributionSubmited,
  deleteContribution,
  updateContribution,
  getAllContributions,
  getDetailContribution,
  updateCommentContribution,
};
