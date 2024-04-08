import React, { useEffect, useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip, List, Skeleton, Avatar } from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { WrapperHeader } from '../CoordinatorEvent/style';
import TableComponent from '../../TableComponent/TableComponent';
import * as EventService from '../../../services/EventService'
import { Link } from 'react-router-dom';
import CoordinatorContribution from '../CoordinatorContribution/CoordinatorContribution';
import { jwtTranslate } from '../../../utilis';
import { useCookies } from 'react-cookie';

const CoordinatorEvent = () => {
    ////lấy sự kiện còn valid
    const [itemsEvent, setItemsEvent] = useState([]);
    const [initLoading, setInitLoading] = useState(true);
    const [eventId, setEventId] = useState(null);
    const [showContribution, setShowContribution] = useState(false);
    const [cookiesAccessToken, setCookieAccessToken] = useCookies('')

    const marketingaccount = jwtTranslate(cookiesAccessToken);
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

        fetchEventData().
            then((res) => {
                setInitLoading(false);
            });;
    }, []);
    const handleViewContribution = (eventId) => {
        setShowContribution(true);
        setEventId(eventId)
    };
    const { Search } = Input;
    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1677ff',
            }}
        />
    );
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <div>
            <WrapperHeader><p>List of </p></WrapperHeader>
            <div>
                <Space direction="vertical">
                    <Search
                        placeholder="Search by title"
                        onSearch={onSearch}
                        style={{
                            width: 200,
                        }}
                    />
                </Space>
            </div>
            <div style={{ padding: '50px' }}>
                {!showContribution && (
                    <>
                        <div>Sự kiện đang diễn ra</div>
                        <List
                            className="demo-loadmore-list"
                            loading={initLoading}
                            itemLayout="horizontal"
                            dataSource={itemsEvent}
                            renderItem={(item) => {
                                // Hàm định dạng lại giờ và phút thành chuỗi có hai chữ số
                                const formatTime = (time) => {
                                    const formattedTime = time.toString().padStart(2, '0');
                                    return formattedTime;
                                };

                                // Hàm định dạng lại ngày và giờ thành chuỗi theo định dạng mong muốn
                                const formatDateTime = (dateTime) => {
                                    const date = new Date(dateTime);
                                    const formattedDate = `${formatTime(date.getHours())}:${formatTime(date.getMinutes())} (${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()})`;
                                    return formattedDate;
                                };

                                return (
                                    <List.Item
                                        actions={[
                                            <a key="list-loadmore-edit" onClick={() => handleViewContribution(item.key)}>
                                                View all contribution
                                            </a>
                                        ]}
                                    >
                                        <Skeleton avatar title={false} loading={item.loading} active>
                                            <List.Item.Meta
                                                title={<a href="https://ant.design">{item?.name}</a>}
                                                description={`Open Date: ${formatDateTime(item?.openDate)}, First Close Date: ${formatDateTime(item?.firstCloseDate)}, Final Close Date: ${formatDateTime(item?.finalCloseDate)}`}
                                            />
                                            <div>content</div>
                                        </Skeleton>
                                    </List.Item>
                                );
                            }}
                        />
                    </>)}
                {showContribution && <CoordinatorContribution eventId={eventId} facultyId={marketingaccount?.faculty}/>}
            </div>
        </div>

    )
}

export default CoordinatorEvent
