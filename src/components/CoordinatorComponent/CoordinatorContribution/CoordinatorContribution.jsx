import React, { useEffect, useState } from 'react'
import * as ContributionService from '../../../services/ContributionService'
import * as FacultyService from '../../../services/FacultyService'
import * as UserService from '../../../services/UserService'
import { Avatar, Button, Descriptions, Dropdown, InputNumber, List, Space } from 'antd'
import { ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, DownOutlined } from '@ant-design/icons'
import wordlogo from '../../../assets/images/image.png'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../../DrawerComponent/DrawerComponent'
import { useCookies } from 'react-cookie'
import InputComponent from '../../InputComponent/InputComponent'
import TextArea from 'antd/es/input/TextArea'
import ButtonComponent from '../../ButtonComponent/ButtonComponent'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as Message from '../../../components/Message/Message'
import { jwtTranslate } from '../../../utilis'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import ModalComponent from '../../ModalComponent/ModalComponent'
const CoordinatorContribution = ({ eventId, facultyId }) => {
    ///setup trạng thái
    const items = [
        {
            label: 'Accepted',
            key: 'Accepted',
        },
        {
            label: 'Rejected',
            key: 'Rejected',
        },
    ]
    ////format datetime
    const formatTime = (time) => {
        const formattedTime = time.toString().padStart(2, '0');
        return formattedTime;
    };

    // Hàm định dạng lại ngày và giờ thành chuỗi theo định dạng mong muốn
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = `${formatTime(date.getHours())}:${formatTime(date.getMinutes())} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return formattedDate;
    };
    const [cookiesAccessToken, setCookieAccessToken, removeCookie] = useCookies('')
    const marketingaccount = jwtTranslate(cookiesAccessToken);
    //setup faculty label
    const [itemsFaculty, setItemsFaculty] = useState([]);
    useEffect(() => {
        const fetchFacultyData = async () => {
            try {
                const res = await FacultyService.getAllFaculty();
                // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
                const formattedData = res.data.map(faculty => ({
                    key: faculty._id, // Gán id vào key
                    label: faculty.name, // Gán name vào name
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
    ////lấy tên học sinh
    const [itemsStudent, setItemsStudent] = useState([]);
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const res = await UserService.getAllUser();
                const filteredStudents = res.data.filter(user => user.role === 'Student');
                const formattedData = filteredStudents.map(student => ({
                    key: student._id,
                    label: student.name,
                }));
                setItemsStudent(formattedData);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentData();
    }, []);

    const studentLabel = (studentId) => {
        const student = itemsStudent.find(student => student.key === studentId);
        return student ? student.label : '';
    };
    //lấy dữ liệu contribution
    const fetchListContribution = async () => {
        const res = await ContributionService.getAllContributions();
        return res?.data?.filter(contribution => contribution?.eventId === eventId && contribution?.facultyId === facultyId);
    };
    const contributionQuerry = useQuery({
        queryKey: ['contributions'],
        queryFn: fetchListContribution,
        config: { retry: 3, retryDelay: 1000 }
    });
    const { data: contributions } = contributionQuerry;
    /////drawer để xem: 
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [contributionDetail, setContributionDetail] = useState({
        studentId: "",
        title: "",
        wordFile: "",
        imageFiles: "",
        submission_date: "",
        lastupdated_date: "",
        eventId: "",
        facultyId: "",
        status: "",
        score: "",
        comment: "",
    });
    const handleOpenDrawer = async (id) => {
        const res = await ContributionService.getDetailContribution(id, cookiesAccessToken)
        setContributionDetail(res.data)
        setIsOpenDrawer(true);
    }
    const handleOnChangeComment = (e) => {
        setContributionDetail({
            ...contributionDetail,
            [e.target.name]: `e.target.value^${marketingaccount?.id}`
        })
    }
    const handleOnChangeScore = (e) => {
        setContributionDetail({
            ...contributionDetail,
            [e.target.name]: e.target.value
        })
    }
    const handleStatusClick = ({ key }) => {
        setContributionDetail({
            ...contributionDetail,
            status: key,
        })
    };
    const menuStatus = {
        items: items,
        onClick: handleStatusClick,
    };
    const mutationUpdate = useMutationHooks(
        (data) => {
            const { contributionDetail } = data
            const res = ContributionService.updateContribution(contributionDetail?._id, contributionDetail)
            return res
        }
    )
    const handleMarking = () => {
        mutationUpdate.mutate({ id: contributionDetail?._id, contributionDetail }, {
            onSettled: () => {
                contributionQuerry.refetch()
            }
        })
    }
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            Message.success()
            setIsOpenDrawer(false)
        } else if (isErrorUpdated) {
            Message.error()
        }
    }, [isSuccessUpdated])
    //xem file
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wordContent, setWordContent] = useState('');
    const [wordName, setWordName] = useState('');
    const handleViewWord = async (content, name) => {
        try {
            // Lưu nội dung của file word vào state
            setWordContent(content);
            setWordName(name);
            // Mở modal
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching word content:', error);
        }
    }
    return (
        <div>
            <div>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 5,
                    }}
                    hoverable={true}
                    dataSource={contributions}
                    renderItem={(item) => (
                        <List.Item
                            key={item?._id}
                            extra={
                                item && item.imageFiles && item?.imageFiles?.length > 0 ? (
                                    <img
                                        width={200}
                                        alt="logo"
                                        src={item.imageFiles[0]}
                                    />
                                ) : (
                                    <img
                                        width={200}
                                        alt="file-icon"
                                        src={wordlogo}
                                    />
                                )
                            }
                            onClick={() => handleOpenDrawer(item?._id)}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={
                                    <div style={{ gap: '20px' }}>
                                        <div>{item.title}</div>
                                        <div style={{ fontSize: '12px' }}>
                                            {item.status === 'Pending' ? (
                                                <>
                                                    Pending <ReloadOutlined />
                                                </>
                                            ) : item.status === 'Accepted' ? (
                                                <>
                                                    <span style={{ color: 'green' }}>{item.status}</span> <CheckCircleOutlined />
                                                </>
                                            ) : (
                                                <>
                                                    <span style={{ color: 'red' }}>{item.status}</span> <CloseCircleOutlined />
                                                </>
                                            )}
                                        </div>

                                    </div>
                                }
                                description={
                                    <div>
                                        <span style={{ display: 'block' }}>Student ID: {studentLabel(item.studentId)}</span>
                                        <span style={{ display: 'block' }}>Faculty ID: {facultyLabel(item?.facultyId)}</span>
                                        <span style={{ display: 'block' }}>Last Update: {item.lastupdated_date}</span>
                                    </div>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <DrawerComponent title='Chi tiết bài nộp' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
                <div style={{ padding: '0px 200px' }}>
                    <Descriptions title="User Info" bordered contentStyle={{ width: '70%' }} label={{ width: '30%' }} column={1} size='middle'>
                        <Descriptions.Item label="Title">{contributionDetail?.title}</Descriptions.Item>
                        <Descriptions.Item label="Status">{contributionDetail?.status}</Descriptions.Item>
                        <Descriptions.Item label="Student">{studentLabel(contributionDetail?.studentId)}</Descriptions.Item>
                        <Descriptions.Item label="Last Updated">{formatDateTime(contributionDetail?.lastupdated_date)}</Descriptions.Item>
                        <Descriptions.Item label="File Word">{contributionDetail?.nameofword}
                            <Button
                                style={{ marginLeft: '20px' }}
                                onClick={() => handleViewWord(contributionDetail?.content, contributionDetail?.nameofword)}
                            >
                                View</Button>
                        </Descriptions.Item>
                        <Descriptions.Item label="File Image">
                            {contributionDetail?.imageFiles?.length > 0 ? (
                                <>
                                    {`${contributionDetail?.imageFiles.length} pictures`}
                                    <Button style={{ marginLeft: '20px' }}>View</Button>
                                </>
                            ) : (
                                'none'
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div style={{ padding: '0px 200px' }}>
                    <Descriptions title="Coordinator nhận xét" bordered contentStyle={{ width: '70%' }} label={{ width: '30%' }} column={1} size='middle'>
                        <Descriptions.Item label="Status">
                            <Dropdown
                                menu={menuStatus}
                                trigger={['click']}
                                onClick={handleStatusClick}
                            >
                                <a onClick={(e) => e.preventDefault()}>
                                    <Space>
                                        {contributionDetail['status'] !== 'Pending' ? (
                                            <span>{contributionDetail['status']} <DownOutlined /></span>
                                        ) : (
                                            <span>{contributionDetail['status']}<DownOutlined /></span>
                                        )}
                                    </Space>
                                </a>
                            </Dropdown>
                        </Descriptions.Item>
                        {contributionDetail['status'] === 'Accepted' ? (
                            <Descriptions.Item label="Chấm điểm">
                                <InputComponent
                                    status={contributionDetail?.score < 0 || contributionDetail?.score > 10 ? "error" : undefined}
                                    name='score'
                                    style={{ width: 'fit-content', bordered: 'none' }}
                                    type='number'
                                    min={0}
                                    max={10}
                                    onChange={(e) => handleOnChangeScore(e)}
                                />
                            </Descriptions.Item>
                        ) : null}
                        <Descriptions.Item label="Nhận xét" style={{ height: 'fit-content' }}>
                            <TextArea
                                showCount
                                maxLength={100}
                                name='comment'
                                onChange={handleOnChangeComment}
                                placeholder={contributionDetail?.comment && contributionDetail.comment.includes('^') ? contributionDetail.comment.split('^')[0] : 'disable resize'}
                                style={{ height: 120, resize: 'none' }}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <Button type="dashed" onClick={handleMarking}>Submit</Button>
            </DrawerComponent>
            <ModalComponent title={wordName} open={isModalOpen} onCancel={() => setIsModalOpen(false)} width='fit-content' footer=''>
                <div dangerouslySetInnerHTML={{ __html: wordContent }}></div>
            </ModalComponent>
        </div>
    )
}

export default CoordinatorContribution