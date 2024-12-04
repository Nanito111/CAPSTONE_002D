import {cookies} from 'next/headers'

export async function PUT(request:Request){
    const apiUrl = `${process.env.API_URL}/account/password/change`
    const token = cookies().get('access_token')
    const bodyParams = await request.json()
    if(!token){
        return new Response(JSON.stringify({error: 'Unauthorized'}),{
            status: 401,
            headers: {'Content-Type': 'application/json'}
        })
    }
    const value_token = token.value
    try{
        const response = await fetch(apiUrl,{
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${value_token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(bodyParams)
        });

        if (response.status === 204) {
            return new Response(JSON.stringify({ message: 'Password updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ message: 'Error updating password' }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error){
        return new Response(JSON.stringify({error: 'Internal Server Error'}),{
            status: 501,
            headers: {'Content-Type': 'application/json'}
        })
    }
}