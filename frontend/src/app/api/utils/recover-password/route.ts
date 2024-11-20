export async function PUT(request:Request){
    const body = await request.json()
    const token = body.token
    const newPassword = body.newPassword

    const apiUrl = `${process.env.API_URL}/account/password/change`
    try {
        console.log("response pre")
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({"new_password": newPassword})
        });

        if (response.ok) {
            return new Response(JSON.stringify({ message: 'Password updated' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify({ message: 'Error updating password' }), { status: response.status, headers: { 'Content-Type': 'application/json' } });
    }
    catch(error) {
        console.log("error asdasd ", error)
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 501, headers: { 'Content-Type': 'application/json' } });
    }
}