import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import { ReadableOptions } from "stream"
import path from "path"
import mime from "mime/lite"
import { File } from "@/lib/definitions"
import JSZip from "jszip"

export async function GET(request: NextRequest) {
    const location = request.nextUrl.searchParams.get("path")
    console.log("Looking for file " + location)
    const stats = await fs.promises.stat(location) // Get the file size
    const data: ReadableStream<Uint8Array> = streamFile(location) // Stream the file with a 1kb chunk
    const res = new NextResponse(data, {
        status: 200,
        headers: new Headers({
            "content-disposition": `attachment; filename=${path.basename(
                location
            )}`,
            "content-type": mime.getType(path.basename(location)),
            "content-length": stats.size + "",
        }),
    })
    return res
}

export async function POST(request: NextRequest) {
    const body = await request.json()
    const files: File[] = body.files
    console.log("Generating zip file")

    const zip = new JSZip()

    files.forEach((file) => {
        zip.file(file.name, fs.promises.readFile(file.path))
    })

    const archive = await zip.generateAsync({ type: "blob" })

    return new Response(archive, {
        status: 200,
        headers: {
            "Content-Type": "application/zip",
            "content-length": archive.size + "",
        },
    })
}

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(
    path: string,
    options?: ReadableOptions
): ReadableStream<Uint8Array> {
    const downloadStream = fs.createReadStream(path, options)

    return new ReadableStream({
        start(controller) {
            downloadStream.on("data", (chunk: Buffer) =>
                controller.enqueue(new Uint8Array(chunk))
            )
            downloadStream.on("end", () => controller.close())
            downloadStream.on("error", (error: NodeJS.ErrnoException) =>
                controller.error(error)
            )
        },
        cancel() {
            downloadStream.destroy()
        },
    })
}
