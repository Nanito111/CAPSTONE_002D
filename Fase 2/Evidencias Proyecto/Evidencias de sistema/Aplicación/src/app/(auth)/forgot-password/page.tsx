import  { ForgotPasswordForm} from "@/components/auth/ForgotPasswordForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ForgotPassword() {

    return(
        <>
            <Link href={"/"}>
                <Button className="m-5">Volver</Button>
            </Link>
            <div className="flex items-center justify-center min-h-screen flex-col">
                <ForgotPasswordForm />
            </div>
        </>
    )
}