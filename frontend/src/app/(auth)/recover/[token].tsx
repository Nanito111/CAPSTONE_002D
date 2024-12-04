import { RecoverPasswordForm } from "@/components/auth/RecoverPasswordForm"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Recover() {

    return(
        <>
            <Button className="m-5">
                <Link href={"/"} >Volver</Link>
            </Button>
            <div className="flex items-center justify-center min-h-screen flex-col">
                <RecoverPasswordForm />
            </div>
        </>
    )
}