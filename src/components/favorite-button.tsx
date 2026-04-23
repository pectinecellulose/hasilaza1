import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ productId, className, size = "md" }: FavoriteButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setActive(false);
      return;
    }
    supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle()
      .then(({ data }) => setActive(!!data));
  }, [user, productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour ajouter à vos favoris." });
      navigate("/auth");
      return;
    }
    setLoading(true);
    if (active) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId);
      setActive(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, product_id: productId });
      setActive(true);
    }
    setLoading(false);
  };

  const dim = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const ic = size === "sm" ? "w-4 h-4" : "w-4 h-4";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={cn(
        dim,
        "rounded-full bg-card/90 backdrop-blur flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-elegant",
        className,
      )}
    >
      <Heart className={cn(ic, "transition-colors", active ? "fill-destructive text-destructive" : "text-foreground/60")} />
    </button>
  );
}
