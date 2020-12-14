const gc = require('./config/');
const bucket = gc.bucket('gcp-workshop-images');

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file) => new Promise((resolve, reject) => {
    console.log("Upload Image file.");
    const {originalname, buffer} = file;

    const blob = bucket.file(originalname.replace(/ /g, "_"));
    blob.createWriteStream().on('finish', () => {
        gc.bucket(bucket.name)
            .file(blob.name)
            .makePublic()
            .then(() => {
                let Data = [];
                Data.push({
                    id: Math.ceil(Math.random() * 100),
                    username: 'blaine.mincey',
                    imageuri: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
                });
                console.log(Data);
                resolve(Data);
            })
            .catch((e) => {
                reject((e) => console.log(`exec error : ${e}`));
            })
    })
        .on('error', () => {
            reject(`Unable to upload image, something went wrong`)
        })
        .end(buffer)
});

module.exports = uploadImage;