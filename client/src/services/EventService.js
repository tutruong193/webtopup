const moment = require('moment-timezone');
const Event = require("../models/EventModel");

const createEvent = async (data) => {
    try {
        const { name, openDate, firstCloseDate, finalCloseDate } = data;

        // Kiểm tra sự kiện đã tồn tại dựa trên ngày mở cửa và ngày đóng cửa
        const checkEvent = await Event.findOne({ openDate, firstCloseDate, finalCloseDate });
        if (checkEvent) {
            return { status: 'ERR', message: 'Event already exists' };
        }

        // Kiểm tra sự kiện đã tồn tại dựa trên tên sự kiện
        const checkNameEvent = await Event.findOne({ name });
        if (checkNameEvent) {
            return { status: 'ERR', message: 'Event name already exists' };
        }

        // Tạo sự kiện mới
        await Event.create({ name, openDate, firstCloseDate, finalCloseDate });

        return { status: 'OK', message: 'Event created successfully' };
    } catch (error) {
        throw error;
    }
};

const getAllEvents = async () => {
    try {
        const events = await Event.find();
        // Chuyển đổi ngày thành múi giờ của Việt Nam
        const eventsVietNamTime = events.map(event => ({
            ...event._doc,
            openDate: moment(event.openDate).tz('Asia/Ho_Chi_Minh').format(),
            firstCloseDate: moment(event.firstCloseDate).tz('Asia/Ho_Chi_Minh').format(),
            finalCloseDate: moment(event.finalCloseDate).tz('Asia/Ho_Chi_Minh').format()
        }));

        return { status: 'OK', message: 'SUCCESS', data: eventsVietNamTime };
    } catch (error) {
        throw error;
    }
};
const getValidEvents = async () => {
    try {
        const events = await Event.find();
        const validEvents = events.filter(event => {
            const currentDate = moment().tz('Asia/Ho_Chi_Minh');
            return moment(event.finalCloseDate).tz('Asia/Ho_Chi_Minh').isAfter(currentDate);
        });
        const validEventsVietNamTime = validEvents.map(event => ({
            ...event._doc,
            openDate: moment(event.openDate).tz('Asia/Ho_Chi_Minh').format(),
            firstCloseDate: moment(event.firstCloseDate).tz('Asia/Ho_Chi_Minh').format(),
            finalCloseDate: moment(event.finalCloseDate).tz('Asia/Ho_Chi_Minh').format()
        }));
        return { status: 'OK', message: 'SUCCESS', data: validEventsVietNamTime };
    } catch (error) {
        throw error;
    }
};
const updateEvent = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkEvent = await Event.find({ name: data.name })
            if (checkEvent.length > 1) {
                resolve({
                    status: 'ERR',
                    message: 'The name is used'
                })
            } else {
                const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
                resolve({
                    status: 'OK',
                    message: 'Event updated successfully',
                    data: updatedEvent
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
const deleteEvent = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Event.findByIdAndDelete(id);
            resolve({
                status: 'OK',
                message: 'SUCCESS',
            })
        } catch (error) {
            throw error;
        }
    })
};
const detailEvent = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const event = await Event.findOne({
                _id: id
            })
            if (event === null) {
                resolve({
                    status: 'ERR',
                    message: 'The event is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: event
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getEventName = async (id) => {
    try {
        const event = await Event.findById(id);
        if (event) {
            return event.name;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getValidEvents,
    updateEvent,
    deleteEvent,
    detailEvent,
    getEventName
};
