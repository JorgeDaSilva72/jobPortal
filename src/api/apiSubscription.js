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
export async function getSingleSubscription(token, { user_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("user_subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Subscription:", error);
    return null;
  }

  return data;
}
