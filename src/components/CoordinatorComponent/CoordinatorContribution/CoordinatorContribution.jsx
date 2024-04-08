import React, { useEffect, useState } from "react";
import * as ContributionService from "../../../services/ContributionService";
import * as FacultyService from "../../../services/FacultyService";
import * as UserService from "../../../services/UserService";
import {
  Avatar,
  Button,
  Descriptions,
  Dropdown,
  Input,
  List,
  Space,
} from "antd";
import {
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import wordlogo from "../../../assets/images/image.png";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import { useCookies } from "react-cookie";
import InputComponent from "../../InputComponent/InputComponent";
import TextArea from "antd/es/input/TextArea";
import ButtonComponent from "../../ButtonComponent/ButtonComponent";
import { useMutationHooks } from "../../../hooks/useMutationHook";
import * as Message from "../../../components/Message/Message";
import { jwtTranslate } from "../../../utilis";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import ModalComponent from "../../ModalComponent/ModalComponent";
const CoordinatorContribution = ({ eventId, facultyId }) => {
  ///setup trạng thái
  const items = [
    {
      label: "Accepted",
      key: "Accepted",
    },
    {
      label: "Rejected",
      key: "Rejected",
    },
  ];
  ////format datetime
  const formatTime = (time) => {
    const formattedTime = time.toString().padStart(2, "0");
    return formattedTime;
  };
  // Hàm định dạng lại ngày và giờ thành chuỗi theo định dạng mong muốn
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = `${formatTime(date.getHours())}:${formatTime(
      date.getMinutes()
    )} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return formattedDate;
  };
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] =
    useCookies("");
  const marketingaccount = jwtTranslate(cookiesAccessToken);
  //setup faculty label
  const [itemsFaculty, setItemsFaculty] = useState([]);
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const res = await FacultyService.getAllFaculty();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map((faculty) => ({
          key: faculty._id, // Gán id vào key
          label: faculty.name, // Gán name vào name
        }));
        setItemsFaculty(formattedData);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyData();
  }, []);
  const facultyLabel = (facultyId) => {
    const faculty = itemsFaculty.find((faculty) => faculty.key === facultyId);
    return faculty ? faculty.label : "";
  };
  ////lấy tên học sinh
  const [itemsStudent, setItemsStudent] = useState([]);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await UserService.getAllUser();
        const filteredStudents = res.data.filter(
          (user) => user.role === "Student"
        );
        const formattedData = filteredStudents.map((student) => ({
          key: student._id,
          label: student.name,
          facultyId: student.facultyId,
        }));
        setItemsStudent(formattedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchStudentData();
  }, []);

  const studentLabel = (studentId) => {
    const student = itemsStudent.find((student) => student.key === studentId);
    return student ? student.label : "";
  };
  //lấy dữ liệu contribution
  const fetchListContribution = async () => {
    const res = await ContributionService.getAllContributions();
    return res?.data?.filter(
      (contribution) =>
        contribution?.eventId === eventId &&
        contribution?.facultyId === facultyId
    );
  };
  const contributionQuerry = useQuery({
    queryKey: ["contributions"],
    queryFn: fetchListContribution,
    config: { retry: 3, retryDelay: 1000 },
  });
  const { data: contributions } = contributionQuerry;
  /////drawer để xem:
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [status, setStatus] = useState();
  const [contributionDetail, setContributionDetail] = useState({
    studentId: "",
    title: "",
    wordFile: "",
    imageFiles: "",
    submission_date: "",
    lastupdated_date: "",
    confirmed_date: "",
    eventId: "",
    facultyId: "",
    status: "",
    score: "",
    comment: "",
  });
  const handleOpenDrawer = async (id) => {
    const res = await ContributionService.getDetailContribution(
      id,
      cookiesAccessToken
    );
    setContributionDetail(res.data);
    setStatus(res.data.status)
    setIsOpenDrawer(true);
  };
  const handleOnChangeComment = (e) => {
    setContributionDetail({
      ...contributionDetail,
      [e.target.name]: `${e.target.value}^${marketingaccount?.id}`,
    });
  };
  const handleOnChangeScore = (e) => {
    setContributionDetail({
      ...contributionDetail,
      [e.target.name]: e.target.value,
    });
  };
  const handleStatusClick = ({ key }) => {
    setContributionDetail({
      ...contributionDetail,
      status: key,
    });
  };
  const menuStatus = {
    items: items,
    onClick: handleStatusClick,
  };
  const mutationUpdate = useMutationHooks((data) => {
    const { contributionDetail } = data;
    const res = ContributionService.updateContribution(
      contributionDetail?._id,
      contributionDetail
    );
    return res;
  });
  const handleMarking = () => {
    const updatedContribution = {
      ...contributionDetail,
      confirm_date: new Date(), // Thêm trường confirm_date là thời điểm hiện tại
    };
    console.log(updatedContribution);
    mutationUpdate.mutate(
      { id: updatedContribution?._id, contributionDetail: updatedContribution },
      {
        onSettled: () => {
          contributionQuerry.refetch();
        },
      }
    );
  };
  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      Message.success();
      setIsOpenDrawer(false);
    } else if (isErrorUpdated) {
      Message.error();
    }
  }, [isSuccessUpdated]);
  //xem file
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wordContent, setWordContent] = useState("");
  const [wordName, setWordName] = useState("");
  const handleViewWord = async (content, name) => {
    try {
      // Lưu nội dung của file word vào state
      setWordContent(content);
      setWordName(name);
      // Mở modal
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching word content:", error);
    }
  };
  //comment
  const [isBeforeFinalCloseDate, setIsBeforeFinalCloseDate] = useState(true);
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
      contributionDetail?._id,
      `${comment}^${marketingaccount?.id}`
    );
    if (res.status === "OK") {
      Message.success();
      setNewComment(`${comment}^${marketingaccount?.id}`);
    } else if (res.status === "ERR") {
      Message.success(`ERR: ${res.status}`);
    }
  };
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
                  <img width={200} alt="logo" src={item.imageFiles[0]} />
                ) : (
                  <img width={200} alt="file-icon" src={wordlogo} />
                )
              }
              onClick={() => handleOpenDrawer(item?._id)}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={
                  <div style={{ gap: "20px" }}>
                    <div>{item.title}</div>
                    <div style={{ fontSize: "12px" }}>
                      {item.status === "Pending" ? (
                        <>
                          Pending <ReloadOutlined />
                        </>
                      ) : item.status === "Accepted" ? (
                        <>
                          <span style={{ color: "green" }}>{item.status}</span>{" "}
                          <CheckCircleOutlined />
                        </>
                      ) : (
                        <>
                          <span style={{ color: "red" }}>{item.status}</span>{" "}
                          <CloseCircleOutlined />
                        </>
                      )}
                    </div>
                  </div>
                }
                description={
                  <div>
                    <span style={{ display: "block" }}>
                      Student: {studentLabel(item.studentId)}
                    </span>
                    <span style={{ display: "block" }}>
                      Faculty: {facultyLabel(item?.facultyId)}
                    </span>
                    <span style={{ display: "block" }}>
                      Last Update: {item.lastupdated_date}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
      <DrawerComponent
        title="Chi tiết bài nộp"
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
            <Descriptions.Item label="Title">
              {contributionDetail?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {contributionDetail?.status}
            </Descriptions.Item>
            <Descriptions.Item label="Student">
              {studentLabel(contributionDetail?.studentId)}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {formatDateTime(contributionDetail?.lastupdated_date)}
            </Descriptions.Item>
            <Descriptions.Item label="File Word">
              {contributionDetail?.nameofword}
              <Button
                style={{ marginLeft: "20px" }}
                onClick={() =>
                  handleViewWord(
                    contributionDetail?.content,
                    contributionDetail?.nameofword
                  )
                }
              >
                View
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="File Image">
              {contributionDetail?.imageFiles?.length > 0 ? (
                <>
                  {`${contributionDetail?.imageFiles.length} pictures`}
                  <Button style={{ marginLeft: "20px" }}>View</Button>
                </>
              ) : (
                "none"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div style={{ padding: "0px 200px" }}>
          <Descriptions
            title="Coordinator nhận xét"
            bordered
            contentStyle={{ width: "70%" }}
            label={{ width: "30%" }}
            column={1}
            size="middle"
          >
            <Descriptions.Item label="Status">
              <Dropdown
                menu={menuStatus}
                trigger={["click"]}
                onClick={handleStatusClick}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {contributionDetail["status"] !== "Pending" ? (
                      <span>
                        {contributionDetail["status"]} <DownOutlined />
                      </span>
                    ) : (
                      <span>
                        {contributionDetail["status"]}
                        <DownOutlined />
                      </span>
                    )}
                  </Space>
                </a>
              </Dropdown>
            </Descriptions.Item>
            {contributionDetail["status"] === "Accepted" ? (
              <Descriptions.Item label="Chấm điểm">
                <InputComponent
                  status={
                    contributionDetail?.score < 0 ||
                    contributionDetail?.score > 10
                      ? "error"
                      : undefined
                  }
                  name="score"
                  placeholder={contributionDetail?.score}
                  style={{ width: "fit-content", bordered: "none" }}
                  type="number"
                  min={0}
                  max={10}
                  onChange={(e) => handleOnChangeScore(e)}
                />
              </Descriptions.Item>
            ) : null}
            {status !== "Pending" ? (
              <Descriptions.Item
                label="Comment"
                style={{ height: "fit-content" }}
              >
                <div>
                  {contributionDetail?.comment?.length !== 0
                    ? contributionDetail?.comment?.map((comment) => (
                        <div>
                          <span>
                            {comment.split("^")[1] !== marketingaccount?.id
                              ? "Student"
                              : "Me"}
                          </span>
                          <span>: {comment.split("^")[0]}</span>
                        </div>
                      ))
                      
                    : null}
                </div>
                {newComment && (
                    <div>
                      <span>
                        {newComment.split("^")[1] !== marketingaccount?.id
                          ? "Student"
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
                  }}
                >
                  <span>Comment</span>
                  <div style={{ display: "flex" }}>
                    <Input
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Input Comment"
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
            ) : (
              <Descriptions.Item
                label="Comment"
                style={{ height: "fit-content" }}
              >
                <TextArea
                  showCount
                  maxLength={100}
                  name="comment"
                  onChange={handleOnChangeComment}
                  style={{ height: 120, resize: "none" }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Button type="dashed" onClick={handleMarking}>
            Submit
          </Button>
        </div>
      </DrawerComponent>
      <ModalComponent
        title={wordName}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width="fit-content"
        footer=""
      >
        <div dangerouslySetInnerHTML={{ __html: wordContent }}></div>
      </ModalComponent>
    </div>
  );
};

export default CoordinatorContribution;
