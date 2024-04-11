const EventService = require('../services/EventService');
const moment = require('moment-timezone');

const createEvent = async (req, res) => {
    try {
        const { name, openDate, firstCloseDate, finalCloseDate } = req.body;
        if (!name || !openDate || !firstCloseDate || !finalCloseDate) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Input required' // Sửa thông báo
            });
        }
        const openDateSau = new Date(openDate);
        const firstCloseDateSau = new Date(firstCloseDate); // Sửa tên biến
        const finalCloseDateSau = new Date(finalCloseDate); // Thêm biến cho ngày đóng cửa cuối cùng


        if (firstCloseDateSau.getTime() - openDateSau.getTime() < 0 || finalCloseDateSau.getTime() - openDateSau.getTime() < 0 || finalCloseDateSau.getTime() - firstCloseDateSau.getTime() < 0) { // Sửa biến
            return res.status(200).json({
                status: 'ERR',
                message: 'Resubmit dates' // Sửa thông báo
            });
        }
        if (((firstCloseDateSau.getTime() - openDateSau.getTime()) / (1000 * 3600 * 24)) < 14) { // Sửa biến
            return res.status(200).json({
                status: 'ERR',
                message: 'FirstCloseDate must be older than openDate 14 days' // Sửa thông báo
            });
        }
        const currentTimeVietnam = moment().tz('Asia/Ho_Chi_Minh').format();
        const openDateVietNam = moment(openDateSau).tz('Asia/Ho_Chi_Minh');
        const firstCloseDateVietNam = moment(firstCloseDateSau).tz('Asia/Ho_Chi_Minh'); // Sửa biến
        const finalCloseDateVietNam = moment(finalCloseDateSau).tz('Asia/Ho_Chi_Minh'); // Thêm biến
        if (!openDateVietNam.isAfter(currentTimeVietnam) || !firstCloseDateVietNam.isAfter(currentTimeVietnam) || !finalCloseDateVietNam.isAfter(currentTimeVietnam)) { // Sửa biến
            return res.status(200).json({
                status: 'ERR',
                message: 'Time must be older than now'
            });
        }
        const response = await EventService.createEvent(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};

const getAllEvents = async (req, res) => {
    try {
        const response = await EventService.getAllEvents();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};

const getValidEvents = async (req, res) => {
    try {
        const response = await EventService.getValidEvents();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Sử dụng e.message thay vì e
        });
    }
};
const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id
        const { name, openDate, firstCloseDate, finalCloseDate } = req.body;
        const openDateSau = new Date(openDate);
        const firstCloseDateSau = new Date(firstCloseDate); // Sửa tên biến
        const finalCloseDateSau = new Date(finalCloseDate); // Thêm biến cho ngày đóng cửa cuối cùng
        if (((firstCloseDateSau.getTime() - openDateSau.getTime()) / (1000 * 3600 * 24)) < 14) { // Sửa biến
            return res.status(200).json({
                status: 'ERR',
                message: 'FirstCloseDate must be older than openDate 14 days' // Sửa thông báo
            });
        }
        const currentTimeVietnam = moment().tz('Asia/Ho_Chi_Minh').format();
        const firstCloseDateVietNam = moment(firstCloseDateSau).tz('Asia/Ho_Chi_Minh'); // Sửa biến
        const finalCloseDateVietNam = moment(finalCloseDateSau).tz('Asia/Ho_Chi_Minh'); // Thêm biến
        if (!firstCloseDateVietNam.isAfter(currentTimeVietnam) || !finalCloseDateVietNam.isAfter(currentTimeVietnam)) { // Sửa biến
            return res.status(200).json({
                status: 'ERR',
                message: 'Time must be older than now'
            });
        }
        const response = await EventService.updateEvent(eventId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
};
const deleteEvent = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The EventID is required'
            })
        }
        const response = await EventService.deleteEvent(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const detailEvent = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The eventId is required'
            })
        }
        const response = await EventService.detailEvent(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createEvent,
    getAllEvents,
    getValidEvents,
    updateEvent,
    deleteEvent,
    detailEvent
};
