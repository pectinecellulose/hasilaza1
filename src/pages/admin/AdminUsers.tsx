import { useEffect, useState, type FormEvent } from "react";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminRow {
  id: string;
  user_id: string;
  created_at: string;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_roles")
      .select("id, user_id, created_at")
      .eq("role", "admin")
      .order("created_at", { ascending: false });
    setAdmins((data as AdminRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("create-admin", {
      body: { email, password, full_name: fullName },
    });
    setSubmitting(false);

    if (error || (data && data.ok === false)) {
      toast({
        title: "Erreur",
        description: (data?.error as string) ?? error?.message ?? "Création impossible",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Administrateur créé", description: `${email} a maintenant les droits admin.` });
    setEmail("");
    setPassword("");
    setFullName("");
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-3xl font-bold">Administrateurs</h2>
        <p className="text-muted-foreground">Créer de nouveaux comptes administrateurs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Nouvel administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet</Label>
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_email">Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@hasilaza.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_password">Mot de passe (8 caractères min)</Label>
              <Input
                id="admin_password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer l'administrateur"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Administrateurs actuels ({admins.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : admins.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">Aucun admin.</p>
          ) : (
            <div className="space-y-2">
              {admins.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="min-w-0">
                    <p className="font-mono text-xs truncate">{a.user_id}</p>
                    <p className="text-xs text-muted-foreground">
                      Créé le {new Date(a.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Badge variant="secondary">admin</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
