import supabaseClient from "@/utils/supabase";
// import useFetch from "@/hooks/use-fetch";

// Fetch Jobs with Pagination

// Ajout de la fonctionnalité pagination
// Pagination Logic :
// range((page - 1) * perPage, page * perPage - 1) : Cette ligne détermine l'intervalle des résultats à retourner.
// Par exemple, si tu es sur la page 1 avec perPage = 10, cela va chercher les éléments de l'index 0 à 9 (les 10 premiers résultats).
// Pour la page 2, il retournera les résultats de l'index 10 à 19, et ainsi de suite.
// En utilisant page et perPage, tu peux maintenant contrôler combien de résultats sont renvoyés par page.

export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, jobsPerPage = 2 }
) {
  const supabase = await supabaseClient(token);

  // Calcul de l'offset et de la plage pour la pagination
  const from = (page - 1) * jobsPerPage;
  const to = page * jobsPerPage - 1;

  let query = supabase
    .from("jobs")
    // .select("*, saved: saved_jobs(id), company: companies(name,logo_url)")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)", {
      count: "exact", // Include total count
    })
    .range(from, to); // Pagination logic

  // Application des filtres si présents
  // Apply filters if provided
  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Execute the query
  // const { data, error } = await query;
  const { data, error, count } = await query; // 'count' contains the total number of jobs
  console.log("data:", data);
  console.log("count:", count);

  if (error) {
    console.error("Error fetching Jobs:", error);
    // return null;
    return { data: [], totalJobs: 0 }; // Retourne un tableau vide en cas d'erreur
  }

  /// Return paginated jobs along with total count
  return { data, totalJobs: count };
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}
// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}
