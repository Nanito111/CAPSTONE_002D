import  { LoginForm } from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Login() {

    return(
        <>
            <Link href={"/"}>
                <Button className="m-5">Volver</Button>
            </Link>
            <div className="flex items-center justify-center min-h-screen flex-col">
                <LoginForm />
            </div>
        </>
    )
}