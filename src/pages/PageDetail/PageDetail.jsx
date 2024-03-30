import React, { useEffect, useState } from 'react'
import {
  WrapperCardStyle,
  WrapperBigTextHeaderCartStyle,
  WrapperHeaderCart,
  WrapperSmallTextHeaderCartStyle,
  WrapperLinkAuthor,
  WrapperDatePulisher,
  WrapperCard,
  WrapperActionCard
} from './style'
import avatar from '../../assets/images/avatar.jpg'
import pic01 from '../../assets/images/pic01.jpg'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import * as ContributionService from '../../services/ContributionService'
import * as UserService from '../../services/UserService'
import * as FacultyService from '../../services/FacultyService'
import { format } from 'date-fns';
const PageDetail = () => {
  ///lấy detail bài báo cáo
  const { id } = useParams();
  const [detail, setDetail] = useState();
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await ContributionService.getDetailContribution(id);
        setDetail(res.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchDetail();
  }, []);
  console.log(detail)
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
  /// lấy dữ riệu faculty
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
  ///format ngày tháng
  const formatDate = (dateString) => {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(dateString);
    // Định dạng ngày
    const formattedDate = format(date, 'MMMM dd, yyyy');
    return formattedDate;
  };
  return (
    <div style={{ padding: '48px', backgroundColor: '#e6e3e3' }}>
      <div style={{
        marginBottom: '20px',
      }}>Faculty / {facultyLabel(detail?.facultyId)} / {detail?.title} </div>
      <WrapperCardStyle >
        <div style={{
          width: '100%',
          height: '180px',
          display: 'flex',
          borderBottom: 'solid 2px rgba(160, 160, 160, 0.3)',
        }}>
          <WrapperHeaderCart>
            <WrapperBigTextHeaderCartStyle>
              {detail?.title}
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
              {detail?.lastupdated_date && formatDate(detail?.lastupdated_date)}
            </WrapperDatePulisher>
            <div >
              <WrapperLinkAuthor href="#">{studentLabel(detail?.studentId)}</WrapperLinkAuthor>
              <img
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '100%',
                }}
                src={avatar} alt="avatar"></img>
            </div>
          </div>

        </div>
        <WrapperCard>
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '50px' }}>
            <img style={{
              width: '90%',
              height: '60%',
            }}
              alt="example" src={pic01} />
          </div>
          <div style={{ padding: '25px 65px', justifyContent: 'space-between' }}>
            <div>Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor magna enim, ac accumsan tortor cursus at. Phasellus sed ultricies mi non congue ullam corper. Praesent tincidunt sed tellus ut rutrum. Sed vitae justo condimentum, porta lectus vitae, ultricies congue gravida diam non fringilla.</div>
          </div>
          <WrapperActionCard>
            <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '25px', opacity: '0.5' }}>
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
    </div>
  )
}

export default PageDetail