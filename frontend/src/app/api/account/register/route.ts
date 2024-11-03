export async function POST(request: Request) {
    const body = await request.json()
    const apiUrl = `${process.env.API_URL}/account/register`;
    try{
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return Response.json(data);
    }
    catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }