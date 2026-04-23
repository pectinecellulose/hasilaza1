import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "admin@hasilaza.com";
const ADMIN_PASSWORD = "admin@hasilza080";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if any admin already exists
    const { data: existing } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "Admin existe déjà", skipped: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Try create the user
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Administrateur Hasilaza" },
    });

    let userId = created?.user?.id;

    if (createErr && !userId) {
      // Maybe the user already exists - find by listing
      const { data: list } = await supabase.auth.admin.listUsers();
      const found = list?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (!found) throw createErr;
      userId = found.id;
    }

    if (!userId) throw new Error("Impossible d'obtenir l'ID utilisateur");

    // Assign admin role
    const { error: roleErr } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (roleErr && !roleErr.message.includes("duplicate")) throw roleErr;

    return new Response(
      JSON.stringify({ ok: true, message: "Compte admin créé", email: ADMIN_EMAIL, userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
