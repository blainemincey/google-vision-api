const uploadImage = require('./storagehelper');
const Cloud = require('@google-cloud/vision');
const credentials = require('./config/keys.json');

// Creates a client
const visionClient = new Cloud.ImageAnnotatorClient({credentials});

module.exports = (app) => {

    // Smoke Test
    app.get(`/api/test`, async (req, res) => {
        return res.status(200).send("Server Route is Working!");
    });

    //
    app.post(`/api/uploadfile`, async (req, res, next) => {
        console.log("Upload File Route.");
        try {
            const myFile = req.file
            const imageUrl = await uploadImage(myFile)
            res
                .status(200)
                .json({
                    message: "Upload successful",
                    data: imageUrl
                })
        } catch (error) {
            next(error)
        }
    });

    //
    app.post(`/api/vision`, async (req, res, next) => {
        console.log("Vision API Called");
        console.log(req.body.imgUri);
        let publicUrl = req.body.imgUri;

        await visionClient.landmarkDetection(publicUrl)
            .then(result => {
                console.log(result);

                const landmarks = result[0].landmarkAnnotations;
                console.log('Landmark Annotations:');
                let landmarkDescription = landmarks[0].description;
                res
                    .status(200)
                    .json({
                        message: "Landmark detection successful",
                        data: landmarkDescription
                    })

            })
            .catch(error => {
                console.log(error);
            })
    });

    //
    app.get('*', function (req, res) {
        return res.status(404).send("Non-existent route requested.");
    });
};