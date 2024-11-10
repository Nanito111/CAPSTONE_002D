
export async function POST(request: Request) {
  const body = await request.json();
  const apiUrl = `${process.env.API_URL}/account/authenticate`;
  let apiResponse;
  try {
    const username = body.username;
    const password = body.password;
    const grant_type = body.grant_type;
    const bodyrequest = new URLSearchParams({
      username: username,
      password: password,
      grant_type: grant_type,
    }).toString();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: bodyrequest,
    };
    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();
    const token_type = data.token_type;
    const access_token = data.access_token;
    const expires_in = data.expires_in;
    const cookieOptions = `HttpOnly; Secure; Path=/; Max-Age=${expires_in}`;
    const tokenTypeCookie = `token_type=${token_type}; ${cookieOptions}`;
    const accessTokenCookie = `access_token=${access_token}; ${cookieOptions}`;
    const authCookie = `authenticated=true; ${cookieOptions}`;

    apiResponse = new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      apiResponse = new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `${tokenTypeCookie}, ${accessTokenCookie}, ${authCookie}`,
        },
      });
    }
    return apiResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}