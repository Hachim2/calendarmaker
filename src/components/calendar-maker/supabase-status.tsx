"use client"

import { useState, useEffect } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { checkSupabaseConnection } from "@/lib/supabase-check"

export function SupabaseStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    message?: string
    error?: string
    checking: boolean
  }>({
    connected: false,
    checking: true,
  })

  const checkConnection = async () => {
    setStatus((prev) => ({ ...prev, checking: true }))

    try {
      const result = await checkSupabaseConnection()
      setStatus({
        connected: result.connected,
        message: result.message,
        error: result.error,
        checking: false,
      })
    } catch (error: any) {
      setStatus({
        connected: false,
        error: error.message || "Une erreur est survenue lors de la vérification",
        checking: false,
      })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <Alert
      className={`mb-6 ${status.connected ? "bg-green-50 border-green-200" : status.checking ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {status.checking ? (
            <Loader2 className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
          ) : status.connected ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
          )}
          <div>
            <AlertTitle
              className={status.connected ? "text-green-800" : status.checking ? "text-blue-800" : "text-red-800"}
            >
              {status.checking
                ? "Vérification de la connexion Supabase..."
                : status.connected
                  ? "Connexion Supabase établie"
                  : "Problème de connexion Supabase"}
            </AlertTitle>
            <AlertDescription
              className={status.connected ? "text-green-700" : status.checking ? "text-blue-700" : "text-red-700"}
            >
              {status.checking
                ? "Veuillez patienter pendant la vérification de la connexion..."
                : status.connected
                  ? status.message
                  : status.error}
            </AlertDescription>
          </div>
        </div>
        {!status.checking && (
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            className={
              status.connected ? "bg-white text-green-700 hover:bg-green-50" : "bg-white text-red-700 hover:bg-red-50"
            }
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Vérifier à nouveau
          </Button>
        )}
      </div>
    </Alert>
  )
}
