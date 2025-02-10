import multer from 'multer'
import { __dirname } from '../dirname-utils.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file)
    cb(null, `${__dirname}/public/images`);
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, file.originalname)
  },
});

export const uploader = multer({ storage: storage });
