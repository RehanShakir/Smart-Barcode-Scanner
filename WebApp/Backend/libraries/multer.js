const S3 = require("aws-sdk/clients/s3.js");
const fs = require("fs");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3({
  apiVersion: "api-v1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const fileFilter = (req, file, cb) => {
  cb(
    file.mimetype === "image/jpeg" || file.mimetype === "image/png"
      ? (null, true)
      : new Error("Only Image Uploads are accepted")
  );
};

module.exports = multer({
  storage: multerS3({
    fileFilter,
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldName }),
    key: (req, file, cb) =>
      cb(null, `projects/${req?.body?.title}${Date.now().toString()}`),
  }),
});

const uploadPhoto = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: fileStream,
    Key: file.filename + "-" + file.originalname,
  };
  return s3.upload(uploadParams).promise();
};

module.exports = {
  uploadPhoto: uploadPhoto,
};
