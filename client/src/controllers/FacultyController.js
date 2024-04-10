const FacultyService = require('../services/FacultyService')
const createFaculty = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The faculty name is required.'
            })
        } else {
            const response = await FacultyService.createFaculty(name)
            return res.status(200).json(response)
        }
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteFaculty = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The faculty id is required.'
            });
        }

        const response = await FacultyService.deleteFaculty(id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Trả về thông báo lỗi cụ thể
        });
    }
};
const getAllFaculty = async (req, res) => {
    try {
        const response = await FacultyService.getAllFaculty();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Trả về thông báo lỗi cụ thể
        });
    }
};
const getNameFaculty = async (req, res) => {
    try {
        const response = await FacultyService.getNameFaculty(req.params.id);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Trả về thông báo lỗi cụ thể
        });
    }
};
const updateFaculty = async (req, res) => {
    try {
        const id = req.params.id;
        const {name} = req.body
        if(!id){
            return res.status(400).json({
                status: 'ERR',
                message: 'The faculty id is required.'
            });
        }
        const response = await FacultyService.updateFaculty(id,name);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message // Trả về thông báo lỗi cụ thể
        });
    }
};
module.exports = {
    createFaculty,
    deleteFaculty,
    getAllFaculty,
    getNameFaculty,
    updateFaculty
}