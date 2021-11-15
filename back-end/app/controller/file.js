const axios = require('axios');
const path = require('path');
const fsPromise = require("fs").promises;/* API to create new Item */
const fs = require('fs');
const cf = require('../utils/core_func');
const util = require("util");
const multer = require("multer");
const upload = multer();
let _detectImagefileToServer = async (req, res) => {
  try {
    const { url,name } = req.body // or any file format
    let list = [];
    for(let i = 0 ; i < url.length; i++){
      const fileName = '_public/detect_images/'+name;
      if(cf.existFile(fileName)) list.push(fileName)
      else{
        const downloadedStatus = await downloadFile(url,fileName);
        if(downloadedStatus == true) list.push(fileName)
      }
    }
    return res.status(200).json({result:list})
  } catch (err) {
      console.log(err)
    return res.status(404).json({message: 'something went wrong' });
  }
}
async function downloadFile (filePath,fileName) {  
  const writer = fs.createWriteStream(fileName);
  const response = await axios({
    url:filePath,
    method: 'GET',
    responseType: 'stream'
  })
  const pipe_r = response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    pipe_r.on('finish', function(){
     return resolve(true);
    })
    pipe_r.on('error', function(){
      return reject;
     })
  })
}
async function readFile(filePath) {
  try {
    const data = await fsPromise.readFile(filePath);
    return data;
  } catch (error) {
    return false;
  }
}
const storage_account = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(`${__dirname}/../../_public/image/account`));
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    var datetimestamp = Date.now();
    callback(null, file.originalname);
  }
});

const uploadAccountImages = multer({ storage: storage_account }).array("files",10);
const _uploadAccountImages = util.promisify(uploadAccountImages);
module.exports = {
  _detectImagefileToServer,
  _uploadAccountImages,
}