import { signIn } from "@/auth"
import GoogleIcon from "@/components/ui/svg/google-icon"

export default function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google")
      }}
    >
        <button className="flex flex-justify" type="submit">
          <GoogleIcon/> Iniciar sesión con Google
        </button>
    </form>
  )
}