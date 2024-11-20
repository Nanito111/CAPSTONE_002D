import { cookies } from 'next/headers';

export async function GET() {
    const cookiesToDelete = [ 'authenticated', 'token_type', 'access_token' ];
    try {
        const authCookie = cookies().get('authenticated');
        if (!authCookie) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        cookiesToDelete.forEach(cookie => {
            cookies().delete(cookie);
        });
        return new Response(JSON.stringify({ message: 'Session Killed' }), { status: 200, headers: { 'Content-Type': 'application/json'} });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}