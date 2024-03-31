import { Image, Popconfirm, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import * as EventService from '../../../services/EventService'
import * as ContributionService from '../../../services/ContributionService'
import * as FacultyService from '../../../services/FacultyService'
import TableComponent from '../../TableComponent/TableComponent';
import * as UserService from '../../../services/UserService'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useCookies } from 'react-cookie'
import ModalComponent from '../../ModalComponent/ModalComponent'
import axios from 'axios'
import * as Message from '../../../components/Message/Message'
const ManagerContribution = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
    ///action
    const renderAction = (record) => {
        return (
            <div>
                <EyeOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => hanldeView(record.key)} />
                <DownloadOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />
            </div>
        )
    }
    ///columns
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Faculty',
            dataIndex: 'faculty',
            key: 'faculty',
        },
        {
            title: 'Last Updated Date',
            dataIndex: 'lastupdated_date',
            key: 'lastupdated_date',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: (_, record) =>
                dataTable.length >= 1 ? (
                    <div>
                        <EyeOutlined onClick={() => hanldeView(record.key)} style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
                        <Popconfirm title={`Download ${record.fileName} ?`} onConfirm={() => handleDownLoad(record.key)}>
                            <DownloadOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />
                        </Popconfirm>
                    </div>
                ) : null,
        }
    ];
    ///set up chọn sự kiện và event
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const handleChange = (value) => {
        setSelectedEvent(value);
    };
    const handleFacultyChange = (value) => {
        setSelectedFaculty(value);
    };
    ///lấy thông tin tất cả user có role là student
    const [stateUser, setStateUser] = useState();
    useEffect(() => {
        const fetchUserAll = async () => {
            const res = await UserService.getAllUser();
            if (res?.data) {
                setStateUser(res?.data.filter(user => user.role === 'Student'));
            }
        };
        fetchUserAll();
    }, []);
    ///lấy thông tin events
    const [itemsEvent, setItemsEvent] = useState([]);
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const res = await EventService.getAllEvent();
                const formattedData = res.data.map(event => ({
                    key: event._id,
                    label: event.name,
                    openDate: event.openDate,
                    firstCloseDate: event.firstCloseDate,
                    finalCloseDate: event.finalCloseDate
                }));
                setItemsEvent(formattedData);
            } catch (error) {
                console.error('Error fetching Event data:', error);
            }
        };
        fetchEventData();
    }, []);
    /////lấy thông tin faculty
    const [itemsFaculty, setItemsFaculty] = useState([]);
    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const res = await FacultyService.getAllFaculty();
                const formattedData = res.data.map(faculty => ({
                    key: faculty._id,
                    name: faculty.name,
                }));
                setItemsFaculty(formattedData);
            } catch (error) {
                console.error('Error fetching faculty data:', error);
            }
        };

        fetchFacultyData();
    }, []);
    ///lấy dữ liệu cho table
    const [dataTable, setDataTable] = useState([]);
    const fetchContributionData = async () => {
        if (selectedEvent && selectedFaculty) {
            try {
                const res = await ContributionService.getContributionsByEventAndFaculty(selectedEvent, selectedFaculty);
                if (res?.data) {
                    const dataTableData = res.data.map(contribution => {
                        const user = stateUser.find(user => user._id === contribution.studentId);
                        return {
                            key: contribution._id,
                            name: user?.name || 'N/A',
                            email: user?.email || 'N/A',
                            faculty: user?.faculty || 'N/A',
                            lastupdated_date: contribution.lastupdated_date,
                            status: contribution.status,
                            wordFile: contribution.wordFile,
                            imageFiles: contribution.imageFiles,
                            fileName: contribution.nameofword
                        };
                    });
                    setDataTable(dataTableData);
                }
            } catch (error) {
                console.error('Error fetching contribution data:', error);
            }
        }
    };
    useEffect(() => {
        fetchContributionData();
    }, [selectedEvent, selectedFaculty]);
    ////view file
    const [detailContribution, setDetailContribution] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const hanldeView = async (id) => {
        try {
            const res = await ContributionService.getDetailContribution(id);
            setDetailContribution(res.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching contribution by id:', error);
        }
        setIsModalOpen(true)
    }
    ///Download single file
    const handleDownLoad = async (id) => {
        try {
            const res = await axios.get(`http://localhost:3001/downloadZip/${id}`, {
                responseType: 'blob', // Đặt kiểu dữ liệu trả về là blob
            });
            // Tạo một đường dẫn URL tạm thời cho blob
            const url = window.URL.createObjectURL(res.data);
            // Tạo một thẻ a để tải xuống tệp
            const a = document.createElement('a');
            a.href = url;
            a.download = `Files.zip`; // Tên của tệp tải xuống
            document.body.appendChild(a);
            a.click();
            // Giải phóng đường dẫn URL
            window.URL.revokeObjectURL(url);
            Message.success('Successfully downloaded files');
        } catch (error) {
            console.error('Error downloading file:', error);
            Message.error('Failed to download file');
        }
    }
    return (
        <div>
            <div>DANH SÁCH TÀI LIỆU</div>
            <Select
                style={{
                    width: 120,
                }}
                onChange={handleChange}
                options={itemsEvent.map(item => ({
                    label: item.label,
                    value: item.key
                }))}
            />
            <Select
                style={{ width: 120 }}
                onChange={handleFacultyChange}
                options={itemsFaculty.map(item => ({ label: item.name, value: item.key }))}
            />
            {selectedFaculty && selectedEvent && (
                <div>
                    <TableComponent columns={columns} dataSource={dataTable} />
                </div>
            )}
            <ModalComponent title={detailContribution?.nameofword} open={isModalOpen} onCancel={() => setIsModalOpen(false)} width='80%' footer=''>
                {detailContribution?.imageFiles?.length !== 0 &&
                    <div>
                        <div>Image</div>
                        <div>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {detailContribution?.imageFiles?.map((image, index) => (
                                    <Image key={index} src={image} alt={`Image ${index}`} style={{ marginRight: '10px', marginBottom: '10px', maxHeight: '100px' }} />
                                ))}
                            </div>
                        </div>
                    </div>}
                <div>
                    <div>View file word</div>
                    <div dangerouslySetInnerHTML={{ __html: detailContribution?.content }}></div>
                </div>
            </ModalComponent>
        </div>
    )
}

export default ManagerContribution;
