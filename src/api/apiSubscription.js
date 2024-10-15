import supabaseClient from "@/utils/supabase";

// - post subscription
export async function addNewSubscription(token, _, subscriptionData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("user_subscriptions")
    .insert([subscriptionData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating subscription");
  }

  return data;
}

// Get user subscription
/**
 * Récupère l'abonnement unique d'un utilisateur à partir de Supabase.
 *
 * @param {string} token - Token d'authentification pour Supabase.
 * @param {Object} params - Paramètres de la fonction.
 * @param {string} params.user_id - Identifiant unique de l'utilisateur.
 * @returns {Object} Les données de l'abonnement de l'utilisateur.
 * @throws {Error} Si une erreur survient lors de la récupération des données.
 */
export async function getSingleSubscription(token, { user_id }) {
  try {
    // Vérification des paramètres
    if (!user_id) {
      throw new Error("user_id is required");
    }

    const supabase = await supabaseClient(token); // initialise le client Supabase en utilisant un token fourni

    // Construction et exécution de la requête
    let query = supabase
      .from("user_subscriptions") //  cible la table user_subscriptions
      .select("*") // Sélectionne toutes les colonnes de la table.
      .eq("user_id", user_id) //Filtre les résultats pour ne récupérer que les enregistrements où la colonne user_id correspond à la valeur fournie.

      .single(); //Indique que l'on s'attend à un seul enregistrement. Si plusieurs enregistrements correspondent, une erreur sera générée.

    const { data, error } = await query; // La requête est exécutée et les résultats sont destructurés en data et error.

    // Gestion des erreurs de la requête
    if (error) {
      // console.error("Error fetching Subscription:", error);
      console.error(
        "Error fetching Subscription:",
        error.message,
        error.details
      );
      throw new Error("Error Fetching subscription");
      // return null;
    }
    // Retour des données si tout est OK
    return data; // Retour des Données
  } catch (err) {
    // Gestion des erreurs inattendues
    console.error("Unexpected error in getSingleSubscription:", err);
    throw err; // Vous pouvez choisir de gérer l'erreur différemment
  }
}
