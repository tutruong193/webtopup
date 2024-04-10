const NotificationService = require('../services/NotificationService');

const getAllNotifications = async (req, res) => {
    try {
        const response = await NotificationService.getAllNotifications();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};
const readAllNotifications = async (req, res) => {
    try {
        const response = await NotificationService.readAllNotifications();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};
const readOneNotifications = async (req, res) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(200).json({
                status: 'ERR',
                message: 'The id required'
            })
        }
        const response = await NotificationService.readOneNotifications(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};


module.exports = {
    getAllNotifications,
    readAllNotifications,
    readOneNotifications
};
