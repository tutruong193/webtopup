import React, { useEffect, useState } from 'react'
import * as FacultyService from '../../../services/FacultyService'
import * as EventService from '../../../services/EventService'
import * as ContributionService from '../../../services/ContributionService'
import * as UserService from '../../../services/UserService'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const ManagerDashboard = () => {
    /// lấy dữ riệu faculty
    const [itemsFaculty, setItemsFaculty] = useState([]);
    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const res = await FacultyService.getAllFaculty();
                // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
                const formattedData = res.data.map(faculty => ({
                    key: faculty._id, // Gán id vào key
                    name: faculty.name, // Gán name vào name
                }));
                setItemsFaculty(formattedData);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            }
        };

        fetchFacultyData();
    }, []);
    const facultyLabel = (facultyId) => {
        const faculty = itemsFaculty.find(faculty => faculty.key === facultyId);
        return faculty ? faculty.label : '';
    };
    ////lấy sự kiện còn valid
    const [itemsEvent, setItemsEvent] = useState([]);
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await EventService.getAllEventValid();
                // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
                const formattedData = res.data.map(event => ({
                    key: event._id, // Gán id vào key
                    name: event.name, // Gán name vào name
                    openDate: event.openDate,
                    firstCloseDate: event.firstCloseDate,
                    finalCloseDate: event.finalCloseDate
                }));
                setItemsEvent(formattedData);
            } catch (error) {
                console.error('Error fetching Event data:', error);
            }
        };
        fetchEventData()
    }, []);
    ///lấy contribution
    const [contributions, setContributions] = useState()
    useEffect(() => {
        const fetchContribution = async () => {
            try {
                const res = await ContributionService.getAllContributions();
                setContributions(res?.data)
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            }
        };

        fetchContribution();
    }, [])
    ///lấy users
    const [students, setStudents] = useState()
    useEffect(() => {
        const fetchContribution = async () => {
            try {
                const res = await UserService.getAllUser();
                setStudents(res?.data?.filter(student => student.role === 'Student'))
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            }
        };

        fetchContribution();
    }, [])
    // const getTotalStudentsByFaculty = () => {
    //     const totals = {};
    //     students.forEach(student => {
    //         const faculty = itemsFaculty.find(faculty => faculty.key === student.facultyId);
    //         if (faculty) {
    //             totals[faculty.name] = (totals[faculty.name] || 0) + 1;
    //         }
    //     });
    //     return totals;
    // };

    const data = {
        labels: itemsFaculty.map(item => item.name),
        datasets: [{
            label: 'Weekly Sales',
            // data: Object.values(getTotalStudentsByFaculty()),
            backgroundColor: [
                'rgba(255, 26, 104, 0.2)',
            ],
            borderColor: [
                'rgba(255, 26, 104, 1)',
            ],
            borderWidth: 1
        }]
    }
    const options = {

    }
    return (
        <div>
            <div>Dashboard</div>
            <div style={{ maxHeight: '200px' }}>
                <Bar
                    options={options}
                    data={data}
                />
            </div>
        </div>
    )
}

export default ManagerDashboard