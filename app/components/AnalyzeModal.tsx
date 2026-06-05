'use client'
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

type Stage = "idle" | "loading" | "result" | "error";

interface Product {
  title: string;
  price: string;
  source: string;
  image: string;
  link: string;
  store: string;
  reason: string;
  label: string;
}

interface Results {
  recommended: Product | null;
  cheaper: Product | null;
  safer: Product | null;
}

export default function AnalyzeModal({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const start = async () => {
    // console.log("START CALLED, selectedFile:", selectedFile?.name);
    if (!selectedFile) {
      // console.log("NO FILE SELECTED");
      return;
    }
    setOpen(true);
    setStage("loading");
    setError(null);

    try {
      const supabase = createClient();

      const fileName = `${userId}/${Date.now()}-${selectedFile.name}`;
      // console.log("Uploading to Supabase, fileName:", fileName);
      
      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.log("UPLOAD ERROR:", uploadError.message);
        throw new Error("Fotoğraf yüklenemedi: " + uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("product-photos")
        .getPublicUrl(fileName);

      console.log("Upload OK, publicUrl:", publicUrl);

      const response = await fetch("https://emavia.app.n8n.cloud/webhook/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: publicUrl, user_id: userId }),
      });

      console.log("n8n response status:", response.status);

      const data = await response.json();
      // console.log("RAW DATA:", JSON.stringify(data));

      const res = data[0]?.results || data?.results;
      // console.log("RES:", JSON.stringify(res));

      if (!res) throw new Error("Sonuç alınamadı");

      await supabase.from("search_history").insert({
        user_id: userId,
        photo_url: publicUrl,
        results: res,
      });
      
      setResults(JSON.parse(res));
      setStage("result");
      
    } catch (err: any) {
      console.log("CATCH ERROR:", err.message);
      setError(err.message || "Bir hata oluştu");
      setStage("error");
    }
  };

  const close = () => {
    setOpen(false);
    setStage("idle");
    setResults(null);
    setError(null);
  };

  return (
    <>
      <label>Product photo
        <input
          ref={fileInputRef}
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <label className="upload-box" onClick={() => fileInputRef.current?.click()}>
        <span>Tap to upload product photo</span>
        <small>JPG, PNG, or phone screenshot</small>
        {preview && (
          <img src={preview} alt="preview" style={{ maxHeight: 200, marginTop: 8, borderRadius: 8 }} />
        )}
      </label>

      <Button
        onClick={start}
        disabled={!selectedFile}
        variant={"default"}
        size={"full"}
      >
        Analyze
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-2xl rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>

            {stage === "loading" && (
              <div className="loading-card">
                <div className="orb" />
                <h2>Analyzing</h2>
                <div className="steps">
                  <div className="step active">Reading product</div>
                  <div className="step active">Checking price</div>
                  <div className="step active">Comparing alternatives</div>
                  <div className="step">Preparing answer</div>
                </div>
              </div>
            )}

            {stage === "error" && (
              <div className="result-card">
                <h2>Bir hata oluştu</h2>
                <p>{error}</p>
                <button onClick={close} className="secondary-btn">Tekrar Dene</button>
              </div>
            )}

            {stage === "result" && results && (
              <div className="bg-black">
                <p className="eyebrow">Results</p>
                <div className="flex flex-col gap-10">
                {[results.recommended, results.cheaper, results.safer]
                  .filter(Boolean)
                  .map((product, i) => product && (
                    <div key={i} className="flex justify-center">
                        <div className="flex flex-2 justify-center">
                          {product.image && (
                            <img src={product.image} alt={product.title} width={160} height={160} style={{ objectFit: "cover", borderRadius: 8 }} />
                          )}
                          </div>
                        <div className="flex flex-3 flex-col justify-center ">
                          <p className="text-xl text-(--secondary) font-extrabold uppercase">{product.label}</p>
                          <p className="text-sm">{product.reason}</p>
                        </div>
                        <div className="flex flex-1 flex-col justify-center items-center">
                          <p className="">{product.price}</p>
                          <a href={product.link} target="_blank">
                          <Button
                            
                          >
                            
                            {product.store}
                          </Button>
                          </a>
                        </div>
                        
                      </div>
                      
                  ))}
                    <div className="flex justify-between">
                      <Button variant={"destructive"} onClick={close}>Close</Button>
                      <Button variant={"default"} onClick={close}>Analyze Another</Button>
                    </div>
                  </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
