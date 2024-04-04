import React, { useEffect, useState } from 'react'
import {
    WrapperCardStyle, WrapperBigTextHeaderCartStyle, WrapperHeaderCart,
    WrapperSmallTextHeaderCartStyle,
    WrapperLinkAuthor,
    WrapperDatePulisher,
    WrapperCard,
    WrapperActionCard
} from './style'
import avatar from '../../assets/images/avatar.jpg'
import pic01 from '../../assets/images/pic01.jpg'
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { HeartOutlined, CommentOutlined } from '@ant-design/icons';
import * as UserService from '../../services/UserService'
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
const BigCardComponent = ({ title, date, author, Avatar = avatar, img = pic01, id, ...props }) => {
    const navigate = useNavigate()
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
    ///format ngày tháng
    const formatDate = (dateString) => {
        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const date = new Date(dateString);
        // Định dạng ngày
        const formattedDate = format(date, 'MMMM dd, yyyy');
        return formattedDate;
    };
    //ấn đọc
    const handleRead = (id) => {

        navigate(`/detail/${id}`)
    }
    return (
        <WrapperCardStyle >
            <div style={{
                width: '100%',
                height: '20%',
                display: 'flex',
                padding: '50px 0px',
                borderBottom: 'solid 2px rgba(160, 160, 160, 0.3)',
            }}>
                <WrapperHeaderCart>
                    <WrapperBigTextHeaderCartStyle>
                        {title}
                    </WrapperBigTextHeaderCartStyle>
                    <WrapperSmallTextHeaderCartStyle>
                        LOREM IPSUM DOLOR AMET NULLAM CONSEQUAT ETIAM FEUGIAT
                    </WrapperSmallTextHeaderCartStyle>
                </WrapperHeaderCart>
                <div style={{
                    width: '25%', display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight: '30px',
                    backgroundColor: 'white'
                }}>
                    <WrapperDatePulisher>
                        {formatDate(date)}
                    </WrapperDatePulisher>
                    <div >
                        <WrapperLinkAuthor href="#">{studentLabel(author)}</WrapperLinkAuthor>
                        <img
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '100%',
                            }}
                            src={Avatar}></img>
                    </div>
                </div>

            </div>
            <WrapperCard>
                <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '50px' }}>
                    <img style={{
                        maxWidth: '80%'
                    }}
                        alt="example" src={img} />
                </div>
                <div style={{ padding: '0px 40px', paddingBottom: '50px', justifyContent: 'space-between' }}>
                    <div>Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non congue ullam corper. Praesent tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.</div>
                </div>
                <WrapperActionCard>
                    <div style={{ width: '50%' }}>
                        <ButtonComponent
                            onClick={() => handleRead(id)}
                            textButton='Continue Reading'
                            styleButton={{
                                color: 'black',
                                fontSize: '15px',
                                height: '56px',
                                width: '220px',
                                fontFamily: "'Raleway', 'Helvetica', sans-serif",
                                fontWeight: '800',
                                letterSpacing: '0.2em',
                            }}
                        ></ButtonComponent>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '50%', alignItems: 'center', opacity: '0.5' }}>
                        <div style={{ paddingRight: '10px' }}>
                            <HeartOutlined /> <span style={{ marginLeft: '5px', opacity: 0.5 }}>20</span>
                        </div>
                        <div style={{ paddingRight: '10px' }}>
                            <CommentOutlined /> <span style={{ marginLeft: '5px', opacity: 0.5 }}>100</span>
                        </div>
                    </div>
                </WrapperActionCard>
            </WrapperCard>
        </WrapperCardStyle >

    )
}

export default BigCardComponent