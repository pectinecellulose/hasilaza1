import { useEffect, useState } from "react";
import { Settings, Save, Loader2, Mail, Phone, MapPin, Building2, Bell, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "hasilaza_admin_settings";

interface AdminSettings {
  shopName: string;
  legalName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  description: string;
  emailNotifications: boolean;
  newOrderAlerts: boolean;
  newMessageAlerts: boolean;
  deliveryFee: string;
  freeDeliveryThreshold: string;
}

const DEFAULTS: AdminSettings = {
  shopName: "Hasilaza Motor",
  legalName: "Hasilaza Motor SARL",
  email: "hasilazasenegal@gmail.com",
  phone: "+221 76 935 83 17",
  whatsapp: "221769358317",
  address: "HLM 2",
  city: "Dakar",
  description: "Leader sénégalais de la vente de tricycles cargo, motos et pièces détachées.",
  emailNotifications: true,
  newOrderAlerts: true,
  newMessageAlerts: true,
  deliveryFee: "0",
  freeDeliveryThreshold: "0",
};

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
    setLoading(false);
  }, []);

  const update = <K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      toast({ title: "Paramètres enregistrés", description: "Vos préférences ont été sauvegardées." });
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'enregistrer." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Configuration</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-1">Paramètres</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personnalisez les informations de votre boutique et les préférences.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Enregistrer
        </Button>
      </div>

      {/* Boutique */}
      <section className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Informations de la boutique</h2>
            <p className="text-xs text-muted-foreground">Identité visible publiquement</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="shopName">Nom de la boutique</Label>
            <Input id="shopName" value={settings.shopName} onChange={(e) => update("shopName", e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="legalName">Raison sociale</Label>
            <Input id="legalName" value={settings.legalName} onChange={(e) => update("legalName", e.target.value)} className="rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="description">Description courte</Label>
            <Textarea id="description" rows={3} value={settings.description} onChange={(e) => update("description", e.target.value)} className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Coordonnées</h2>
            <p className="text-xs text-muted-foreground">Informations de contact affichées sur le site</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</Label>
            <Input id="email" type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Téléphone</Label>
            <Input id="phone" value={settings.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">Numéro WhatsApp (sans +)</Label>
            <Input id="whatsapp" value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city" className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Ville</Label>
            <Input id="city" value={settings.city} onChange={(e) => update("city", e.target.value)} className="rounded-xl" />
          </div>
          <div className="md:col-span-2 space-y-1.5">
            <Label htmlFor="address">Adresse complète</Label>
            <Input id="address" value={settings.address} onChange={(e) => update("address", e.target.value)} className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* Livraison */}
      <section className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Livraison</h2>
            <p className="text-xs text-muted-foreground">Tarification de la livraison</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="deliveryFee">Frais de livraison Dakar (FCFA)</Label>
            <Input id="deliveryFee" type="number" value={settings.deliveryFee} onChange={(e) => update("deliveryFee", e.target.value)} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="freeDeliveryThreshold">Seuil livraison gratuite (FCFA)</Label>
            <Input id="freeDeliveryThreshold" type="number" value={settings.freeDeliveryThreshold} onChange={(e) => update("freeDeliveryThreshold", e.target.value)} className="rounded-xl" />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Notifications</h2>
            <p className="text-xs text-muted-foreground">Alertes administrateur par email</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { key: "emailNotifications" as const, label: "Notifications email globales", desc: "Activer toutes les notifications email" },
            { key: "newOrderAlerts" as const, label: "Nouvelle commande", desc: "Recevoir un email à chaque nouvelle commande" },
            { key: "newMessageAlerts" as const, label: "Nouveau message contact", desc: "Recevoir un email à chaque message reçu" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl border border-border">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={settings[item.key]} onCheckedChange={(v) => update(item.key, v)} />
            </div>
          ))}
        </div>
      </section>

      {/* Apparence */}
      <section className="bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
            <Settings className="w-5 h-5 text-secondary-foreground" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Apparence</h2>
            <p className="text-xs text-muted-foreground">Préférences d'affichage</p>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border">
          <div>
            <p className="font-medium text-sm">Thème sombre</p>
            <p className="text-xs text-muted-foreground">Activer le mode nuit pour l'interface admin</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </section>
    </div>
  );
};

export default AdminSettingsPage;
