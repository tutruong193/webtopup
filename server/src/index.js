const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const mammoth = require("mammoth");
const multer = require("multer");
dotenv.config();
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);
const Docxtemplater = require("docxtemplater");
const archiver = require("archiver");
const app = express();
const port = process.env.PORT || 3001;
const Contribution = require("./models/ContributionModel");
const FacultyService = require("./services/FacultyService");
const UserService = require("./services/UserService");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.get("/getfiles/:id", async (req, res) => {
  try {
    const fileWord = req.params.id;
    const link = path.join(__dirname, "files", fileWord);
    res.send({
      status: "OK",
      link: link,
    });
  } catch (error) {
    res.json({ status: error });
  }
});
routes(app);
mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("connect DB success");
  })
  .catch((e) => {
    console.log(e);
  });
const uploadDestination = path.join(__dirname, "files");
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});
app.post("/upload-files", upload.single("file"), async (req, res) => {
  try {
    // Đường dẫn tệp tải lên
    const filePath = req.file.path;
    process.env.FILENAME = req.file.filename;
    // Sử dụng Mammoth để chuyển đổi tệp Word thành HTML
    mammoth
      .convertToHtml({ path: filePath })
      .then((result) => {
        const htmlContent = result.value; // Nội dung HTML
        // Lưu nội dung HTML vào cơ sở dữ liệu hoặc thực hiện các xử lý khác ở đây
        res.send({ status: "OK", htmlContent: htmlContent });
      })
      .catch((error) => {
        console.error("Error converting file to HTML:", error);
        res
          .status(500)
          .json({ status: "Error", message: "Failed to convert file to HTML" });
      });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ status: "Error", message: "Failed to upload file" });
  }
});
app.get("/downloadZip/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const id = req.params.id;
      const data = await Contribution.findById(id);
      const wordName = data?.nameofworddb;
      const faculty = await FacultyService.getNameFaculty(data.facultyId);
      const student = await UserService.getUserName(data.studentId);
      const archive = archiver("zip", {
        zlib: { level: 9 }, // Mức độ nén cao nhất
      });
      archive.pipe(res);
      // Tạo thư mục cho facultyId
      archive.directory(`src/files/${faculty}`, `${faculty}`);
      // Tạo thư mục cho studentId trong thư mục faculty
      archive.directory(
        `src/files/${faculty}/${student}`,
        `${faculty}/${student}`
      );
      // Thêm tệp vào thư mục student
      archive.file(`src/files/${wordName}`, {
        name: `${faculty}/${student}/${wordName}`,
      });
      for (let i = 0; i < data.imageFiles.length; i++) {
        const base64Data = data.imageFiles[i];
        const base64Image = base64Data.split(";base64,").pop();
        const decodedImage = Buffer.from(base64Image, "base64");
        archive.append(decodedImage, {
          name: `${faculty}/${student}/image_${i}.jpg`,
        });
      }
      res.attachment("File.zip");
      // Đợi cho tất cả các dữ liệu được thêm vào archive hoàn tất trước khi kết thúc response
      archive.finalize();
    } else {
      res
        .status(500)
        .json({ status: "Error", message: "Contribution doest exist" });
    }
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to upload file" });
  }
});
app.get("/downloadZips", async (req, res) => {
  try {
    const ids = req.query.selectedIds.split(",");
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Highest compression level
    });

    // Pipe the output stream to the HTTP response
    archive.pipe(res);

    // Process each selectedId
    for (const id of ids) {
      const data = await Contribution.findById(id);
      const wordName = data?.nameofworddb;
      const faculty = await FacultyService.getNameFaculty(data.facultyId);
      const student = await UserService.getUserName(data.studentId);
      // Create a directory for facultyId
      archive.directory(`src/files/${faculty}`, `zip/${faculty}`);
      // Create a directory for studentId within the faculty directory
      archive.directory(
        `src/files/${faculty}/${student}`,
        `${faculty}/${student}`
      );
      // Add the word file to the student directory
      archive.file(`src/files/${wordName}`, {
        name: `${faculty}/${student}/${wordName}`,
      });
      // Add image files to the student directory
      for (let i = 0; i < data.imageFiles.length; i++) {
        const base64Data = data.imageFiles[i];
        const base64Image = base64Data.split(";base64,").pop();
        const decodedImage = Buffer.from(base64Image, "base64");
        archive.append(decodedImage, {
          name: `${faculty}/${student}/image_${i}.jpg`,
        });
      }
    }

    // Finalize the archive, this will trigger 'close' event
    archive.finalize();

    let downloadTriggered = false;

    // Listen for the 'close' event, then trigger the download
    archive.on("close", () => {
      if (downloadTriggered === false) {
        downloadTriggered = true;

        res.download("Files.zip", () => {
        });
      }
    });

    // archive.finalize();
  } catch (error) {
    // Handle errors by sending an appropriate response
    console.error(error.message);
    res
      .status(500)
      .json({ status: "Error", message: "Failed to create zip file" });
  }
});

app.listen(port, () => {
  console.log("connecting with port " + port);
});
