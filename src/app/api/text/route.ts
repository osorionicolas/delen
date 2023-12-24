let text = ""

export async function GET() {
  return new Response(text, {
    status: 200,
  });
}

export async function POST(request: Request) {
  console.log("Saving text...")
  const body = await request.json();
  text = body.text;
  return new Response(undefined, {
    status: 204,
  });
}