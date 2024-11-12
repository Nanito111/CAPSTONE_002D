import {cookies} from 'next/headers'

export async function GET(request:Request){
    const apiUrl = `${process.env.API_URL}/account/user`
    try{
        const auth_token = cookies().get('access_token')
        if(!auth_token){
            return new Response(JSON.stringify({error: 'Unauthorized'}),{
                status: 401,
                headers: {'Content-Type': 'application/json'}
            })
        }
        const value_token = auth_token.value
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${value_token}`,
                "Content-Type": 'application/json'
            }
        }
        const response = await fetch(apiUrl, requestOptions)
        if (response.ok){
            const data = await response.json()
            return new Response(JSON.stringify(data),{
                status: response.status,
                headers: {'Content-Type': 'application/json'}
            })
        }
        return new Response(JSON.stringify({error: 'External Server Error'}),{
            status: response.status,
            headers: {'Content-Type': 'application/json'}
        })


    } catch (error){
        return new Response(JSON.stringify({error: 'Internal Server Error'}),{
            status: 500,
            headers: {'Content-Type': 'application/json'}
        })
    }
}
