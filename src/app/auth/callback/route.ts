import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Échanger le code contre une session
    await supabase.auth.exchangeCodeForSession(code)

    // Vérifier si l'utilisateur existe dans notre table users
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", user.email).maybeSingle()

      // Si l'utilisateur n'existe pas dans notre table, le créer
      if (!existingUser) {
        await supabase.from("users").insert([
          {
            name: user.user_metadata.name || user.email?.split("@")[0] || "Utilisateur",
            email: user.email,
            password: "**********", // Ne pas stocker le vrai mot de passe
            admin_permissions: false,
          },
        ])
      }
    }
  }

  // Rediriger vers la page d'accueil
  return NextResponse.redirect(new URL("/", request.url))
}
