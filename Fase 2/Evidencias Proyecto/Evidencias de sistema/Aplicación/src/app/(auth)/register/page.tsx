import  { RegisterForm } from "@/components/auth/RegisterForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Register() {

    return(
        <>
            <Button className="m-5">
                <Link href={"/"} >Volver</Link>
            </Button>
            <div className="flex items-center justify-center min-h-screen">
                <RegisterForm />
            </div>
        </>
    )
}