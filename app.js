if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const path = require('path');
const storage = require('azure-storage');

const blobService = storage.createBlobService();

const listContainers = async () => {
    return new Promise((resolve, reject) => {
        blobService.listContainersSegmented(null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} containers`, containers: data.entries });
            }
        });
    });
};

const createContainer = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Container '${containerName}' created` });
            }
        });
    });
};

const uploadString = async (containerName, blobName, text) => {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(containerName, blobName, text, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Text "${text}" is written to blob storage` });
            }
        });
    });
};

const uploadLocalFile = async (containerName, filePath) => {
    return new Promise((resolve, reject) => {
        const fullPath = path.resolve(filePath);
        const blobName = path.basename(filePath);
        blobService.createBlockBlobFromLocalFile(containerName, blobName, fullPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Local file "${filePath}" is uploaded` });
            }
        });
    });
};

const listBlobs = async (containerName) => {
    return new Promise((resolve, reject) => {
        blobService.listBlobsSegmented(containerName, null, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `${data.entries.length} blobs in '${containerName}'`, blobs: data.entries });
            }
        });
    });
};

const downloadBlob = async (containerName, blobName) => {
    const dowloadFilePath = path.resolve('./' + blobName.replace('.txt', '.downloaded.txt'));
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, blobName, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Blob downloaded "${data}"`, text: data });
            }
        });
    });
};

var express = require('express'),
    app = express(),
	bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

const portNumber = 1239;

app.use('/', express.static(path.join(__dirname, 'dist')));

app.listen(portNumber, function() {
	console.log("Express http server listenting on port " + portNumber);
});
    
upload_string = async (data,uuid) => {
    const containerName = "demo";
    const blobName = uuid + ".txt";
	response = await uploadString(containerName, blobName, data);
	return response;
}

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/upload_string', function(req, res) {
    console.log(req.body)
    upload_string(JSON.stringify(req.body),req.body.uuid).then((response) => {
        console.log(response);
        res.status(200).send({
            success: 'true',
            message: response
        })          
    });
});


download_blob = async () => {
 const containerName = "demo";
 const blobName = "7be55182-742a-4426-8aa1-227981951d3e.txt";
 response = await downloadBlob(containerName, blobName); 
 console.log(response);
 return response
};


app.get('/api/download_blob', function(req, res) {
	download_blob().then((response) => {
		console.log(response)
		res.status(200).send({
			success: 'true',
			message: response
		})	
	})
});

