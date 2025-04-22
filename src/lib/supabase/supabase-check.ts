import { supabase } from "./supabase-client"

/**
 * Vérifie la connexion à Supabase
 * @returns Un objet contenant le statut de la connexion
 */
export async function checkSupabaseConnection() {
  try {
    // Tenter une requête simple pour vérifier la connexion
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("Erreur de connexion Supabase:", error.message)
      return {
        connected: false,
        error: error.message,
      }
    }

    return {
      connected: true,
      message: "Connexion à Supabase établie avec succès",
    }
  } catch (error: any) {
    console.error("Erreur inattendue lors de la vérification de la connexion:", error.message)
    return {
      connected: false,
      error: error.message,
    }
  }
}
