import React from 'react'
import SmallCartComponent from '../../components/SmallCardComponent/SmallCardComponent'
import BigCardComponent from '../../components/BigCardComponent/BigCardComponent'
import {
  Wrapper,
  WrapperSlider,
  WrapperMiniPost,
  WrapperContent,
  WrapperImage
} from './style'
import logo from '../../assets/images/logo.jpg'
const HomePage = () => {
  return (
    <Wrapper>
      <WrapperSlider>
        <div>
          <img src={logo} ></img>
          <h1
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: '900',
              padding: '20px 0',
              marginTop: '14px'
            }}>FUTURE IMPERFECT</h1>
          <div
            style={{
              fontFamily: "'Raleway', 'Helvetica', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              paddingBottom: '50px',
              borderBottom: 'solid 1px rgba(160, 160, 160, 0.3)',
              marginBottom: '50px'
            }}>ANOTHER FINE RESPONSIVE SITE TEMPLATE BY HTML5 UP</div>
        </div>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
        <WrapperMiniPost>
          <SmallCartComponent />
        </WrapperMiniPost>
      </WrapperSlider>
      <WrapperContent>
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
        <div style={{ paddingBottom: '40px' }}>
          <BigCardComponent />
        </div>
      </WrapperContent>
    </Wrapper>

  )
}

export default HomePage
// import React, { useState } from 'react';
// import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
// import { Button, Upload, message } from 'antd';
// import axios from 'axios';

// const getBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// };

// const HomePage = () => {
//   const [fileList, setFileList] = useState([]);
//   const beforeUpload = (file) => {
//     const isImage = file.type === 'image/jpeg' || // .jpeg
//       file.type === 'image/png' || // .png
//       file.type === 'image/bmp';  // .bmp
//     const isLt5M = file.size / 1024 / 1024 < 5;
//     if (!isImage) {
//       message.error(`${file.name} is not a valid file. Please upload high-quality image (jpg, jpeg, png, bmp).`);
//       return Upload.LIST_IGNORE;
//     } else if (!isLt5M) {
//       message.error('File phải nhỏ hơn 5MB!');
//       return Upload.LIST_IGNORE;
//     }
//     return false
//   }

//   const handleOnChange = async (info) => {
//     const { fileList } = info;
//     if (fileList.length > 3) {
//       message.error('Bạn chỉ được phép tải lên tối đa 3 file ảnh.');
//       return;
//     }
//     const promises = fileList.map(async (file) => {
//       if (!file.url && !file.preview) {
//         file.preview = await getBase64(file.originFileObj);
//       }
//       return file;
//     });
//     Promise.all(promises).then((updatedFileList) => {
//       setFileList(updatedFileList);
//     });
//   };
//   return (
//     <>
//       <Upload
//         onChange={handleOnChange}
//         maxCount={3}
//         listType="picture"
//         beforeUpload={beforeUpload}
//         showRemoveIcon={true}
//         showPreviewIcon={false} // Ẩn nút xem trước
//       >
//         <Button icon={<UploadOutlined />} disabled={fileList.length >= 3}>
//           Upload
//         </Button>
//       </Upload>
//     </>
//   );
// };

// export default HomePage;





