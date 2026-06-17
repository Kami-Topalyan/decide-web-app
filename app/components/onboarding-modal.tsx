"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

type Props = {
  userId: string;
};

const PREFERENCE_OPTIONS = [
  "Rahatlık & Konfor",
  "Minimalist & Sade",
  "Gösterişli & İddialı",
  "Teknoloji Tutkunu",
  "Spor & Egzersiz",
  "Evcimen",
  "Maceracı & Doğa",
  "Lüks & Kalite",
  "Trend & Moda"
];

export default function OnboardingModal({ userId }: Props) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0 && !height) {
      setError("Lütfen boyunu gir.");
      return;
    }
    if (step === 1 && !weight) {
      setError("Lütfen kilonu gir.");
      return;
    }
    
    setError(null);
    setStep(step + 1);
  };

  const togglePreference = (pref: string) => {
    setPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (preferences.length === 0) {
      setError("Lütfen en az bir zevk / tercih seçin.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    
    // Save to user_preferences table
    const { error: dbError } = await supabase
      .from("user_preferences")
      .upsert({
        id: userId,
        height,
        weight,
        preferences,
      });

    setLoading(false);

    if (dbError) {
      setError("Veriler kaydedilirken bir hata oluştu: " + dbError.message);
      return;
    }

    setOpen(false);
    router.refresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Seni Tanıyalım 🎯</h2>
          <p className="text-muted-foreground text-sm">
            Sana en uygun kararları verebilmemiz için birkaç detay paylaşmanı istiyoruz.
          </p>
        </div>

        {error && (
          <div className="bg-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl mb-4 border border-destructive/30">
            {error}
          </div>
        )}

        {step === 0 && (
          <form onSubmit={handleNext} className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-2">
              <label htmlFor="height" className="text-sm font-semibold text-foreground text-center">
                Boyun kaç?
              </label>
              <input
                id="height"
                type="number"
                placeholder="Örn: 180"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-muted text-center border border-border rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-secondary min-h-[52px]"
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full mt-2 font-bold min-h-[48px] rounded-xl">
              İleri
            </Button>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={handleNext} className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-2">
              <label htmlFor="weight" className="text-sm font-semibold text-foreground text-center">
                Kilon kaç?
              </label>
              <input
                id="weight"
                type="number"
                placeholder="Örn: 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-muted text-center border border-border rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-secondary min-h-[52px]"
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setStep(0)} className="flex-1 min-h-[48px] rounded-xl">
                Geri
              </Button>
              <Button type="submit" className="flex-1 font-bold min-h-[48px] rounded-xl">
                İleri
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-foreground text-center">
                Zevklerin ve önceliklerin neler? (Birden fazla seçebilirsin)
              </label>
              
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {PREFERENCE_OPTIONS.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
                      preferences.includes(pref)
                        ? "bg-secondary text-secondary-foreground border-secondary"
                        : "bg-muted text-foreground border-border hover:border-secondary/50"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button type="button" disabled={loading} variant="outline" onClick={() => setStep(1)} className="flex-1 min-h-[48px] rounded-xl">
                Geri
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-[2] font-bold bg-secondary text-secondary-foreground min-h-[48px] rounded-xl"
              >
                {loading ? "Kaydediliyor..." : "Tamamla"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
