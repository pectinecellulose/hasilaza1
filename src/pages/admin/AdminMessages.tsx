import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Trash2, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (!error) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Message supprimé" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Messages</h2>
        <p className="text-muted-foreground">{messages.length} message{messages.length > 1 ? "s" : ""} reçu{messages.length > 1 ? "s" : ""}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">Aucun message.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Card key={m.id} className={m.is_read ? "" : "border-primary/40"}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {m.subject}
                    {!m.is_read && <Badge className="bg-primary text-primary-foreground">Nouveau</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    De <span className="font-semibold text-foreground">{m.name}</span> — {new Date(m.created_at).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!m.is_read && (
                    <Button variant="outline" size="sm" onClick={() => markRead(m.id)}>
                      <Check className="w-4 h-4 mr-1" />
                      Marquer lu
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => remove(m.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="border-t border-border pt-4 space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <a href={`mailto:${m.email}`} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      {m.phone}
                    </a>
                  )}
                </div>
                <p className="p-3 bg-muted/50 rounded-lg text-sm text-foreground/80 whitespace-pre-wrap">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
