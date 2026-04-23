import { useState, type FormEvent } from "react";
import { Loader2, Send, CheckCircle2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function RepairRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    vehicle_type: "moto",
    vehicle_brand: "",
    problem_description: "",
    city: "Dakar",
    preferred_date: "",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("repair_requests").insert({
      user_id: user?.id ?? null,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_email: form.customer_email || null,
      vehicle_type: form.vehicle_type,
      vehicle_brand: form.vehicle_brand || null,
      problem_description: form.problem_description,
      city: form.city,
      preferred_date: form.preferred_date || null,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-2">Demande envoyée !</h3>
        <p className="text-muted-foreground">Notre équipe vous contactera très rapidement.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center">
          <Wrench className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Demande de dépannage</h3>
          <p className="text-xs text-muted-foreground">Remplissez le formulaire, on vous rappelle</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rname">Nom *</Label>
          <Input id="rname" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rphone">Téléphone *</Label>
          <Input id="rphone" type="tel" required value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} className="h-11 rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="remail">Email</Label>
        <Input id="remail" type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="h-11 rounded-xl" />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Type de véhicule *</Label>
          <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
            <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="moto">Moto</SelectItem>
              <SelectItem value="tricycle">Tricycle</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rbrand">Marque / modèle</Label>
          <Input id="rbrand" value={form.vehicle_brand} onChange={(e) => setForm({ ...form, vehicle_brand: e.target.value })} className="h-11 rounded-xl" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="rcity">Ville *</Label>
          <Input id="rcity" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="rdate">Date souhaitée</Label>
          <Input id="rdate" type="date" value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} className="h-11 rounded-xl" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rprob">Description du problème *</Label>
        <Textarea id="rprob" required rows={4} value={form.problem_description} onChange={(e) => setForm({ ...form, problem_description: e.target.value })} className="rounded-xl resize-none" />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-semibold">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        Envoyer ma demande
      </Button>
    </form>
  );
}
