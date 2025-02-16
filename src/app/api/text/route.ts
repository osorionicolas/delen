type Text = {
    id: string;
    content: string;
    created_at: string;
};

let text: Text[] = []

export async function GET() {    
  return new Response(JSON.stringify(text.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) ), {
    status: 200,
  });
}

export async function POST(request: Request) {
  console.log("Saving text...")
  const body = await request.json();
  text.push({id: Math.random().toString(36).substring(7), content: body.text, created_at: new Date().toISOString()});
  return new Response(undefined, {
    status: 204,
  });
}