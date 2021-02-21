const express = require("express")
const bp = require("body-parser")
const app = express()
const cors = require('cors')
const multer = require("multer")
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(bp.urlencoded({ extended: false }))
app.use(bp.text())
app.use(express.static(path.join('build')));

const dirPath = process.env.FILES_PATH || "./files"
const port = process.env.PORT || 5000

let text = ""

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, dirPath); // here we specify the destination . in this case i specified the current directory
  },
  filename: function(req, file, callback) {
    console.log(file)
    callback(null, file.originalname)// here we specify the file saving name . in this case i specified the original file name
  }
})

let uploadDisk = multer({ storage: storage })

app.post("/files", uploadDisk.single("file"), (req, res) => {
  console.log("Files uploaded")
  res.send("Files upload success")
})

app.get("/files", (req, res) => {
  console.log("Looking for files...")
  fs.readdir(dirPath, function (err, files) {
    //handling error
    if (err) return console.log('Unable to scan directory: ' + err)
	console.log(files)
    res.send(files)
  })
})

app.get("/files/:file", (req, res) => {
	const file = req.params.file
	console.log("Looking for file " + file);
	res.download(dirPath + "/" + file);
});

app.delete("/files/:file", (req, res) => {
	const file = req.params.file
	console.log("Deleting file " + file)
	fs.rm(dirPath + "/" + file, (err) => {
		if (err) {
		  console.error(err)
		  res.status(500).send({"message": `File: "${file}" couldn't be deleted`})
		}
		else 
			res.sendStatus(204)
	})
})

app.post("/text", (req, res) => {
	if(this.text === undefined)
		this.text = ""
	const body = req.body
	console.log("Saving text...")
	this.text = (body) ? body : ""
	res.send(this.text)
})

app.get("/text", (req, res) => {
	res.send(this.text);
});

app.get('/', function(req, res) {
	const front = path.join('build', 'index.html')
	if(fs.existsSync(front))
		res.sendFile(path.join('build', 'index.html'));
	else
		res.redirect('http://localhost:3000')
});

app.listen(port, () => {
  	console.log("Express server listening on port " + port);
});