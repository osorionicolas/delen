import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { ReadableOptions } from "stream";
import path from "path";

const dirPath = process.env.FILES_PATH || "public/files";

export async function GET(request: NextRequest, { params }: { params: { file: string } }) {
  const file = params.file;
  let location = request.nextUrl.searchParams.get("path");
  if (!location) location = `${dirPath}/${file}`;
  console.log("Looking for file " + location);
  const stats = await fs.promises.stat(location); // Get the file size
  const data: ReadableStream<Uint8Array> = streamFile(location); // Stream the file with a 1kb chunk
  const res = new NextResponse(data, {
    // Create a new NextResponse for the file with the given stream from the disk
    status: 200, //STATUS 200: HTTP - Ok
    headers: new Headers({
      //Headers
      "content-disposition": `attachment; filename=${path.basename(location)}`, //State that this is a file attachment
      "content-type": "application/iso", //Set the file type to an iso
      "content-length": stats.size + "", //State the file size
    }),
  })
  return res
  //download(path, file);
}

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file 
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
    const downloadStream = fs.createReadStream(path, options);

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
            downloadStream.on("end", () => controller.close());
            downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
        },
        cancel() {
            downloadStream.destroy();
        },
    });
}