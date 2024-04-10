import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Upload,
  Descriptions,
  Empty,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  AudioOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { WrapperHeader, WrapperCard } from "../StudentPostBlog/style";
import * as EventService from "../../../services/EventService";
import InputComponent from "../../InputComponent/InputComponent";
import { useMutationHooks } from "../../../hooks/useMutationHook";
import * as ContributionService from "../../../services/ContributionService";
import { Col, Row } from "antd";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import { getBase64, jwtTranslate } from "../../../utilis";
import { useCookies } from "react-cookie";
import * as Message from "../../../components/Message/Message";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "../../ModalComponent/ModalComponent";
import Loading from "../../../components/LoadingComponent/LoadingComponent";
const { TextArea } = Input;
const StudentPostBlog = () => {
  ////setup
  const [isLoading, setIsLoading] = useState(true);
  const [cookiesAccessToken, setCookieAccessToken] = useCookies("");
  const [updateForm, setUpdateForm] = useState({
    studentId: "",
    title: "",
    wordFile: "",
    imageFiles: "",
    submission_date: "",
    lastupdated_date: "",
    eventId: "",
    facultyId: "",
    status: "",
  });
  ///lấy dữ liệu về event đang valid
  const [itemsEvent, setItemsEvent] = useState([]);
  const [itemsUnValidEvent, setItemsUnValidEvent] = useState([]);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await EventService.getAllEvent();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map((event) => ({
          key: event._id, // Gán id vào key
          label: event.name, // Gán name vào name
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate,
        }));
        const currentDateTime = new Date();
        const validEvents = formattedData.filter(
          (event) => new Date(event.finalCloseDate) > currentDateTime
        );
        const UnValidEvents = formattedData.filter(
          (event) => new Date(event.finalCloseDate) < currentDateTime
        );
        setItemsEvent(validEvents);
        setItemsUnValidEvent(UnValidEvents);
      } catch (error) {
        console.error("Error fetching Event data:", error);
      }
    };

    fetchEventData();
  }, []);
  //lấy danh sách bài đã nộp
  const fetchSubmitedContribution = async (studentId) => {
    const res = await ContributionService.getSubmitedContribution(studentId);
    setIsLoading(false);
    return res.data;
  };
  const user = jwtTranslate(cookiesAccessToken.access_token);
  const submitedQuerry = useQuery({
    queryKey: ["submited", user?.id],
    queryFn: () => fetchSubmitedContribution(user?.id),
    config: {
      retry: 3,
      retryDelay: 1000,
    },
  });
  const { data: submited } = submitedQuerry;
  ///format date
  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // Months are zero based
    const year = dateObj.getFullYear();
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };
  //modal add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  ///// card và hành động ấn vào card
  const [eventDetail, setEventDetail] = useState(null);
  const [isBeforeFirstCloseDate, setIsBeforeFirstCloseDate] = useState(true);
  const [isBeforeFinalCloseDate, setIsBeforeFinalCloseDate] = useState(true);
  const handleCardClick = async (eventId) => {
    try {
      const res = await EventService.getDetailsEvent(eventId);
      setEventDetail(res.data);
      fetchData(eventId);
      const currentDateTime = new Date();
      const firstCloseDate = new Date(res.data.firstCloseDate);
      const finalCloseDate = new Date(res.data.finalCloseDate);
      setIsBeforeFinalCloseDate(finalCloseDate > currentDateTime);
      setIsBeforeFirstCloseDate(currentDateTime < firstCloseDate);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
    setIsOpenDrawer(true);
  };

  /////// hiển hị thông tin của event qua drawer
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  ////lấy tên của event qua id
  const eventLabel = (eventId) => {
    const event = itemsEvent.find((event) => event.key === eventId);
    return event ? event.label : "";
  };
  const [selectedFiles, setSelectedFiles] = useState();
  //word
  const propsWord = {
    name: "file",
    multiple: true,
    action: "${process.env.REACT_APP_API_URL}/upload-files",
    beforeUpload: (file) => {
      const isDoc =
        file.type === "application/msword" ||
        file.type === "application/pdf" || // .doc
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // .docx
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!file) {
        message.error("Vui lòng chọn tệp!");
        return false;
      } else if (!isDoc) {
        message.error(
          `${file.name} is not a valid file. Please upload Word document (doc, docx)`
        );
      } else if (!isLt5M) {
        message.error("File phải nhỏ hơn 5MB!");
      }
      return isDoc ? true : Upload.LIST_IGNORE;
    },
    onChange(info, event) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setSelectedFiles(info.fileList[0]);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  //image upload
  const [fileListImage, setFileListImage] = useState([]);
  const beforeUpload = (file) => {
    const isImage =
      file.type === "image/jpeg" || // .jpeg
      file.type === "image/png" || // .png
      file.type === "image/bmp"; // .bmp
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
      message.error(
        `${file.name} is not a valid file. Please upload high-quality image (jpg, jpeg, png, bmp).`
      );
      return Upload.LIST_IGNORE;
    } else if (!isLt5M) {
      message.error("File phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };
  const handleChange = async ({ fileList }) => {
    const previews = fileList.map(async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      return file.preview;
    });
    Promise.all(previews).then((previews) => {
      setFileListImage(previews);
    });
  };
  ////set title
  const [title, setTitle] = useState("");
  const handleOnchange = (e) => {
    setTitle(e.target.value);
  };
  ///add button
  const mutationAdded = useMutationHooks((data) =>
    ContributionService.createContribution(data)
  );
  const handleOk = async () => {
    const user = jwtTranslate(cookiesAccessToken.access_token);
    const imageUrls = fileListImage.map((file) => file);
    const data = {
      studentId: user?.id,
      title: title,
      content: selectedFiles?.response?.htmlContent,
      imageFiles: imageUrls,
      submission_date: Date.now(),
      lastupdated_date: Date.now(),
      eventId: eventDetail?._id,
      facultyId: user?.faculty,
      status: "Pending",
      nameofword: selectedFiles?.name,
      content: selectedFiles?.response?.htmlContent,
    };

    mutationAdded.mutate(data, {
      onSettled: () => {
        submitedQuerry.refetch();
      },
    });
    setIsData(false);
    setIsOpenDrawer(false);
    setIsModalOpen(false);
    setIsModalOpenRule(false);
  };
  const {
    data: dataAdded,
    isSuccess: isSuccessAdded,
    isError: isErrorAdded,
  } = mutationAdded;
  useEffect(() => {
    if (isSuccessAdded && dataAdded?.status === "OK") {
      Message.success();
      setIsModalOpen(false);
    } else if (isErrorAdded && dataAdded?.status === "ERR") {
      Message.error();
    }
  }, [isSuccessAdded]);
  ///lấy dữ liệu của bài đã nộp
  const [detailContribution, setDetailContribution] = useState([]);
  const fetchData = async (eventId) => {
    try {
      const result = submited.filter((data) => data.eventId === eventId);
      if (result && result[0]) {
        setDetailContribution(result[0]);
        setUpdateForm(result);
      } else {
        setDetailContribution(""); // Nếu không có dữ liệu, setDetailContribution thành mảng rỗng
      }
    } catch (error) {
      console.error("Error fetching contribution data:", error);
    }
  };
  ///delete contribution
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteContribution = async () => {
    setIsModalOpenDelete(true);
  };
  const mutationDeleted = useMutationHooks(({ id, accessToken }) => {
    const res = ContributionService.deleteContribution(id, accessToken);
    return res;
  });
  const handleDeleteUser = () => {
    const id = detailContribution?._id;
    const accessToken = cookiesAccessToken;
    mutationDeleted.mutate(
      { id, accessToken },
      {
        onSettled: () => {
          submitedQuerry.refetch();
        },
      }
    );
    setIsModalOpenDelete(false);
    setIsOpenDrawer(false);
  };
  const {
    data: dataDeleted,
    isLoading: isLoadingDeleted,
    isSuccess: isSuccessDelected,
    isError: isErrorDeleted,
  } = mutationDeleted;
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === "OK") {
      Message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      Message.error();
    }
  }, [isSuccessDelected]);
  ///comment
  const [newComment, setNewComment] = useState("");
  const [comment, setComment] = useState("");
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  const handleCommentSubmit = async () => {
    if (comment.trim() !== "") {
      setComment("");
    }
    const res = await ContributionService.updateCommentContributions(
      detailContribution?._id,
      `${comment}^${user?.id}`
    );
    if (res.status === "OK") {
      Message.success();
      setNewComment(`${comment}^${user?.id}`);
    } else if (res.status === "ERR") {
      Message.success(`ERR: ${res.status}`);
    }
  };
  ////update
  const [eventId, setEventId] = useState("");
  const [updateContribution, setUpdateContribution] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [titleUpdate, setTitleUpdate] = useState("");
  const [imageListUpdate, setImageListUpdate] = useState([]);
  const [currentFileList, setCurrentFileList] = useState([]);
  const [isContentChanged, setIsContentChanged] = useState(false);
  const [isChangeWordFile, setIsChangeWordFile] = useState(false);
  const handleOnchangeUpdate = (e) => {
    setTitleUpdate(e.target.value);
  };
  useEffect(() => {
    const checkContentChanged = () => {
      const isTitleChanged = titleUpdate !== updateContribution.title;
      const isImageListChanged =
        JSON.stringify(imageListUpdate) !==
        JSON.stringify(updateContribution.imageFiles);
      setIsContentChanged(isTitleChanged || isImageListChanged);
    };
    checkContentChanged();
  }, [titleUpdate, imageListUpdate, updateContribution]);
  const handleUpdateCancel = () => {
    setIsModalUpdateOpen(false);
  };
  const showUpdateModal = async () => {
    const res = await ContributionService.getDetailContribution(
      detailContribution?._id
    );
    setImageListUpdate(res.data.imageFiles);
    setTitleUpdate(res.data.title);
    setUpdateContribution(res.data);
    setEventId(res.data.eventId);
    setIsModalUpdateOpen(true);
    const newFileWord = [
      {
        uid: "-1",
        name: res.data.nameofword,
        status: "done",
        url: "http://www.example.com/xxx.png", // Thay đổi url này bằng url thực tế của file
      },
    ];
    setCurrentFileList(newFileWord);
  };
  const handleFileRemove = (file) => {
    const newFileList = currentFileList.filter((item) => item.uid !== file.uid);
    setCurrentFileList(newFileList);
  };
  ///word
  const propsWordUpdate = {
    name: "file",
    multiple: false,
    action: "${process.env.REACT_APP_API_URL}/upload-files",
    beforeUpload: (file) => {
      const isDoc =
        file.type === "application/msword" ||
        file.type === "application/pdf" || // .doc
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // .docx
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!file) {
        message.error("Vui lòng chọn tệp!");
        return false;
      } else if (!isDoc) {
        message.error(
          `${file.name} is not a valid file. Please upload Word document (doc, docx)`
        );
      } else if (!isLt5M) {
        message.error("File phải nhỏ hơn 5MB!");
      }
      return isDoc ? true : Upload.LIST_IGNORE;
    },
    onChange(info, event) {
      const { status } = info.file;
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1); // Chỉ lưu trữ file cuối cùng được tải lên
      fileList = fileList.map((file) => ({
        ...file,
        url: file.response ? file.response.url : file.url,
      }));
      setCurrentFileList(fileList);
      if (status !== "uploading") {
        console.log(info.file);
      }
      if (status === "done") {
        message.success(`${info.file.name} file upload successfully.`);
        setIsChangeWordFile(true);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  ///image
  const handleChangeUpdate = async ({ fileList }) => {
    const previews = fileList.map(async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      return file.preview;
    });
    Promise.all(previews).then((previews) => {
      setImageListUpdate(previews);
    });
  };

  ///
  ///update button
  const handleOkUpdate = async () => {
    const user = jwtTranslate(cookiesAccessToken.access_token);
    const data = {
      lastupdated_date: Date.now(),
      status: "Pending",
    };
    if (titleUpdate !== updateContribution?.title) {
      data.title = titleUpdate;
    }
    if (imageListUpdate !== updateContribution?.imageFiles) {
      const imageUrls = imageListUpdate.map((file) => file);
      data.imageFiles = imageUrls;
    }
    if (currentFileList && currentFileList.response) {
      data.nameofword = currentFileList.name; // Cập nhật nameofword
      data.content = currentFileList.response.htmlContent; // Cập nhật content
    }
    const res = await ContributionService.updateContribution(
      detailContribution?._id,
      data
    );
    if (res.status === "OK") {
      Message.success();
      setIsModalUpdateOpen(false);
      setIsOpenDrawer(false);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (res.status === "ERR") {
      Message.error(res.message);
    }
  };
  ////accept điều khoản
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isModalOpenRule, setIsModalOpenRule] = useState(false);
  const showModalRule = () => {
    setIsModalOpenRule(true);
  };

  const handleOkRule = () => {
    setIsModalOpenRule(false);
  };

  const handleCancelRule = () => {
    setIsModalOpenRule(false);
  };
  ////
  const [isData, setIsData] = useState(false);
  const [stateAdd, setStateAdd] = useState(false);
  useEffect(() => {
    if (selectedFiles && title) {
      setIsData(true);
    }
  }, [selectedFiles, title]);
  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  return (
    <div style={{ padding: "50px" }}>
      <WrapperHeader>
        <p>List Of Contributions</p>
      </WrapperHeader>
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
      <div style={{ paddingTop: "50px" }}>
        <Loading isLoading={isLoading}>
          <div>Sự kiện đang diễn ra</div>
          <Row gutter={16}>
            {itemsEvent && itemsEvent.length !== 0 ? (
              itemsEvent.map((event) => (
                <Col span={8} key={event.key}>
                  <WrapperCard
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                        >
                          {event.label}
                        </div>
                        {submited &&
                        submited.some((item) => item.eventId === event.key) ? (
                          <CheckCircleOutlined
                            style={{ color: "green", verticalAlign: "middle" }}
                          />
                        ) : (
                          <CloseCircleOutlined
                            style={{ color: "red", verticalAlign: "middle" }}
                          />
                        )}
                      </div>
                    }
                    bordered={false}
                    hoverable
                    onClick={() => handleCardClick(event.key)}
                  >
                    <p>Open Date: {formatDateTime(event.openDate)}</p>
                    <p>
                      First Close Date: {formatDateTime(event.firstCloseDate)}
                    </p>
                    <p>
                      Final Close Date: {formatDateTime(event.finalCloseDate)}
                    </p>
                  </WrapperCard>
                </Col>
              ))
            ) : (
              <Empty />
            )}
          </Row>
        </Loading>
      </div>
      <div style={{ paddingTop: "50px" }}>
        <Loading isLoading={isLoading}>
          <div>Sự kiện hết hạn</div>
          <Row gutter={16}>
            {itemsUnValidEvent && itemsUnValidEvent.length !== 0 ? (
              itemsUnValidEvent.map((event) => (
                <Col span={8} key={event.key}>
                  <WrapperCard
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            marginRight: "5px",
                            verticalAlign: "middle",
                          }}
                        >
                          {event.label}
                        </div>
                        {submited &&
                        submited.some((item) => item.eventId === event.key) ? (
                          <CheckCircleOutlined
                            style={{ color: "green", verticalAlign: "middle" }}
                          />
                        ) : (
                          <CloseCircleOutlined
                            style={{ color: "red", verticalAlign: "middle" }}
                          />
                        )}
                      </div>
                    }
                    bordered={false}
                    hoverable
                    onClick={() => handleCardClick(event.key)}
                  >
                    <p>Open Date: {formatDateTime(event.openDate)}</p>
                    <p>
                      First Close Date: {formatDateTime(event.firstCloseDate)}
                    </p>
                    <p>
                      Final Close Date: {formatDateTime(event.finalCloseDate)}
                    </p>
                  </WrapperCard>
                </Col>
              ))
            ) : (
              <Empty />
            )}
          </Row>
        </Loading>
      </div>
      <div>
        <Modal
          width={800}
          title="Add New Contributions"
          open={isModalOpen}
          onOk={showModalRule}
          onCancel={handleCancel}
          okButtonProps={{ disabled: !isData }}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 800,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Chủ Đề"
              name="chude"
              rules={[
                {
                  required: true,
                  message: "Please choose title",
                },
              ]}
            >
              <div onChange={handleOnchange}>
                {eventDetail?._id ? eventLabel(eventDetail._id) : ""}
              </div>
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input title",
                },
              ]}
            >
              <InputComponent
                value={title}
                name="title"
                onChange={handleOnchange}
              />
            </Form.Item>
            <Form.Item
              label="Upload File Word"
              name="uploadFileWord"
              rules={[
                {
                  required: true,
                  message: "Please input File!",
                },
              ]}
            >
              <Upload {...propsWord} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Upload File Image" name="uploadFileImg">
              <>
                <Upload
                  onChange={handleChange}
                  maxCount={3}
                  listType="picture"
                  beforeUpload={beforeUpload}
                  showRemoveIcon={true}
                  showPreviewIcon={false} // Ẩn nút xem trước
                >
                  <Button
                    icon={<UploadOutlined />}
                    disabled={fileListImage.length >= 3}
                  >
                    Upload
                  </Button>
                </Upload>
              </>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <DrawerComponent
          title="Chi tiết event"
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          width="90%"
        >
          <div style={{ padding: "0px 200px" }}>
            <Descriptions
              title="User Info"
              bordered
              contentStyle={{ width: "70%" }}
              label={{ width: "30%" }}
              column={1}
              size="middle"
            >
              <Descriptions.Item label="Name of Event">
                {eventDetail?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Open Date">
                {formatDateTime(eventDetail?.openDate)}
              </Descriptions.Item>
              <Descriptions.Item label="First close date">
                {formatDateTime(eventDetail?.firstCloseDate)}
              </Descriptions.Item>
              <Descriptions.Item label="Final close date">
                {formatDateTime(eventDetail?.finalCloseDate)}
              </Descriptions.Item>

              <Descriptions.Item label="Title">
                {detailContribution?.title || "none"}
              </Descriptions.Item>

              <Descriptions.Item label="File Word">
                {detailContribution?.nameofword || "none"}
              </Descriptions.Item>
              <Descriptions.Item label="File Image">
                {detailContribution?.imageFiles?.length !== 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {detailContribution?.imageFiles?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Image ${index}`}
                        style={{
                          marginRight: "10px",
                          marginBottom: "10px",
                          maxHeight: "100px",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  "none"
                )}
              </Descriptions.Item>
            </Descriptions>
            {detailContribution !== "" ? (
              <Descriptions
                title="Contribution Status"
                bordered
                contentStyle={{ width: "70%" }}
                label={{ width: "30%" }}
                column={1}
                size="middle"
              >
                <Descriptions.Item label="Status">
                  {detailContribution?.status || "none"}
                </Descriptions.Item>
                <Descriptions.Item label="Last Updated">
                  {detailContribution?.lastupdated_date
                    ? formatDateTime(detailContribution?.lastupdated_date)
                    : "none"}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Comment"
                  style={{ height: "fit-content" }}
                >
                  {detailContribution?.comment && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                      }}
                    >
                      {detailContribution?.comment?.map((comment) => (
                        <div>
                          <span>
                            {comment.split("^")[1] !== user?.id
                              ? "Coordinator"
                              : "Me"}
                          </span>
                          <span>: {comment.split("^")[0]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {newComment && (
                    <div>
                      <span>
                        {newComment.split("^")[1] !== user?.id
                          ? "Coordinator"
                          : "Me"}
                      </span>
                      <span>: {newComment.split("^")[0]}</span>
                    </div>
                  )}
                  <div
                    style={{
                      borderTop: "1px solid rgba(5, 5, 5, 0.06)",
                      marginTop: "30px",
                      paddingTop: "10px",
                      display:
                        !isBeforeFinalCloseDate ||
                        detailContribution?.status === "Pending"
                          ? "none"
                          : null,
                    }}
                  >
                    <span>Comment</span>
                    <div style={{ display: "flex" }}>
                      <Input
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder="Nhập nội dung comment"
                      />
                      <Button
                        onClick={handleCommentSubmit}
                        disabled={!comment.trim()}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            ) : null}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "25px",
                paddingTop: "25px",
                borderTop: "1px solid",
                gap: "10px",
              }}
            >
              {submited && itemsEvent.length !== 0 && isBeforeFinalCloseDate ? (
                submited.some((item) => item.eventId === eventDetail?._id) ? (
                  <>
                    <Button
                      style={{ width: "100px" }}
                      type="dashed"
                      onClick={showUpdateModal}
                      disabled={!isBeforeFirstCloseDate}
                    >
                      Update
                    </Button>
                    <Button
                      style={{ width: "100px" }}
                      type="dashed"
                      onClick={handleDeleteContribution}
                      disabled={!isBeforeFirstCloseDate}
                    >
                      Remove
                    </Button>
                  </>
                ) : (
                  <Button
                    style={{ width: "100px" }}
                    type="dashed"
                    onClick={showModal}
                  >
                    Add
                  </Button>
                )
              ) : null}
            </div>
          </div>
        </DrawerComponent>
        <ModalComponent
          title="Delete contribution"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteUser}
        >
          <div>Are you sure to delete this contribution? </div>
        </ModalComponent>
        <Modal
          width={800}
          title="Update Contribution"
          open={isModalUpdateOpen}
          onCancel={handleUpdateCancel}
          onOk={handleOkUpdate}
          okButtonProps={{
            disabled: !(isChangeWordFile || isContentChanged),
          }}
        >
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 800,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Form.Item label="Chủ Đề" name="chude">
              <div>{eventId ? eventLabel(eventId) : ""}</div>
            </Form.Item>
            <Form.Item label="Title" name="title">
              <div>
                <div style={{ display: "none" }}>{titleUpdate}</div>
                <InputComponent
                  placeholder={titleUpdate}
                  name="title"
                  onChange={handleOnchangeUpdate}
                />
              </div>
            </Form.Item>
            <Form.Item
              label="Upload File Word"
              name="uploadFileWord"
              rules={[
                {
                  required: true,
                  message: "Please input File!",
                },
              ]}
            >
              <Upload
                {...propsWordUpdate}
                maxCount={1}
                fileList={currentFileList}
                onRemove={handleFileRemove}
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={currentFileList.length > 0 ? true : false}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Upload File Image" name="uploadFileImg">
              <Upload
                onChange={handleChangeUpdate}
                maxCount={3}
                listType="picture"
                beforeUpload={beforeUpload}
                showRemoveIcon={true}
                showPreviewIcon={false}
                defaultFileList={imageListUpdate.map((file, index) => ({
                  uid: index,
                  name: file,
                  status: "done",
                  url: file,
                }))}
              >
                <Button
                  icon={<UploadOutlined />}
                  disabled={imageListUpdate.length >= 3}
                >
                  Upload
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={isModalOpenRule}
          onOk={handleOk}
          onCancel={handleCancelRule}
          okButtonProps={{ disabled: !isCheckboxChecked }}
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <h2>Terms and Conditions</h2>
            <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
              <li>
                Acceptance of Terms of Use: I commit to adhering to all terms
                and conditions of the system, including regulations regarding
                posting and service usage.
              </li>
              <li>
                Copyright and Ownership: I acknowledge that all content and
                materials posted on the system are my own creative work. I agree
                not to copy, modify, or use any content without the permission
                of the rightful owner.
              </li>
              <li>
                Acceptance of Contribution Guidelines: I understand that my
                submissions must comply with the guidelines and standards of the
                system. I pledge to only post articles and materials that I have
                created or have the right to use.
              </li>
              <li>
                Feedback and Edits: I agree to accept feedback and edits from
                marketing coordinators or administrators to improve and refine
                my submissions.
              </li>
              <li>
                Content Responsibility: I acknowledge and accept responsibility
                for the content of my posts. I commit to not posting any
                information that may infringe on the privacy, dignity, or
                copyright of others.
              </li>
              <li>
                Acceptance of Privacy Policy: I agree that my personal
                information may be collected and used according to the privacy
                policy of the system.
              </li>
              <li>
                Posting Deadlines: I commit to posting and updating my
                contributions according to the deadlines set by the system.
              </li>
              <li>
                Compliance with Laws: I pledge to comply with all legal
                regulations related to the use of the system and my postings.
              </li>
              <li>
                Impact on School Reputation: I commit to not posting any
                information or content that could damage the reputation or
                prestige of the school.
              </li>
              <li>
                Compliance Commitment: I commit to adhering to and implementing
                all terms and conditions outlined in this agreement.
              </li>
            </ol>
            <label style={{ display: "block", marginTop: "10px" }}>
              <input
                style={{ marginRight: "10px" }}
                type="checkbox"
                checked={isCheckboxChecked}
                onChange={(e) => setIsCheckboxChecked(e.target.checked)}
              />
              I agree
            </label>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default StudentPostBlog;
