import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import { writeFile } from "fs/promises";
import dirTree from "directory-tree";

const dirPath = process.env.FILES_PATH || "public/files";

export function GET() {
    console.log("Looking for files")
    const tree = dirTree(dirPath, {attributes:["size", "type", "extension"]});
    return Response.json(tree.children)
}

export async function POST(request: NextRequest) {
  const qPath = request.nextUrl.searchParams.get("path");
  const path = qPath ? `${dirPath}/${qPath}` : dirPath;
  if (!fs.existsSync(path)) {
    console.log(`Folder ${path} does not exist`);
    fs.mkdirSync(path);
  }
  const data = await request.formData()
  const file: File = data.get("file") as unknown as File
  if(!file) {
    return NextResponse.json({ message: "File upload failed" }, {status: 400})
  }
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  console.log(path, file.name);
  await writeFile(path + `/${file.name}`, buffer);
  console.log("File uploaded success");
  return NextResponse.json({ message: "File upload success" })
}

export function DELETE(request: NextRequest) {
    const path = request.nextUrl.searchParams.get("path");
    console.log(`Deleting file: ${path} `);
    fs.rm(path!, (err) => {
        if (err) {
          console.error(err);
          return Response.json(
              { message: `File: "${path}" couldn't be deleted` },
              { status: 500 }
          )
        } else return new Response("", {status: 204})
    });
}