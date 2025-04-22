"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/lib/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AuthForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      toast({
        title: "Connexion en cours",
        description: "Vous allez être redirigé...",
      })
    } catch (error) {
      console.error("Erreur de connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec Google. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous pour sauvegarder et synchroniser vos emplois du temps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter avec Google
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 