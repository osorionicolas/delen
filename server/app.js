const express = require("express")
const bp = require("body-parser")
const app = express()
const cors = require('cors')
const multer = require("multer")
const fs = require('fs')
const path = require('path')
const dirTree = require("directory-tree");

app.use(cors())
app.use(bp.urlencoded({ extended: false }))
app.use(bp.text())
app.use(express.static(path.join('build')));

const dirPath = process.env.FILES_PATH
const port = process.env.PORT

let storage = multer.diskStorage({
  destination: function(req, file, callback) {
	const qPath = req.query.path
	const path = (qPath) ? `${dirPath}/${qPath}` : dirPath
	if (!fs.existsSync(path)) {
		console.log(`Folder ${path} does not exist`)
		fs.mkdirSync(path)
	}
    callback(null, path); // here we specify the destination . in this case i specified the current directory
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname)// here we specify the file saving name . in this case i specified the original file name
  }
})

let uploadDisk = multer({ storage: storage })

app.post("/files", uploadDisk.single("file"), (req, res) => {
	console.log("Files uploaded")
	res.send("Files upload success")
})

app.get("/files", (req, res) => {
	console.log("Looking for files")
	const tree = dirTree(dirPath);
	res.send(tree.children)
})

app.get("/files/:file", (req, res) => {
	const file = req.params.file
	let path = req.query.path
	if(!path) path = `${dirPath}/${file}`
	console.log("Looking for file " + path);
	res.download(path, file);
});

app.delete("/files", (req, res) => {
	const path = req.query.path
	console.log(`Deleting file: ${path} `)
	fs.rm(path, (err) => {
		if (err) {
		  console.error(err)
		  res.status(500).send({"message": `File: "${path}" couldn't be deleted`})
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

app.listen(port, () => {
  	console.log("Express server listening on port " + port);
});