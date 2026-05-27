'use client'

import { useState } from "react";

type Stage = "idle" | "loading" | "result";

export default function AnalyzeModal() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");

  const start = async () => {
    setOpen(true);
    setStage("loading");

    await new Promise((r) => setTimeout(r, 10000));

    setStage("result");
  };

  const close = () => {
    setOpen(false);
    setStage("idle");
  };

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={start}
        className="primary-btn full"
      >
        Analyze
      </button>

      {/* MODAL BACKDROP */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          
          {/* MODAL CARD */}
          <div
            className="w-full max-w-2xl rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* LOADING */}
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

            {/* RESULT */}
            {stage === "result" && (
              <div className="space-y-6 text-center">
                    <div className="result-card">
                        <p className="eyebrow">Answer</p>
                        <div className="score-ring">
                            <span>87%</span>
                            <small>confidence</small>
                        </div>
                        <h2 className="verdict buy-text">Buy</h2>
                        <div className="reasons">
                            <p>Good value against similar options.</p>
                            <p>Low regret risk based on price and use case.</p>
                            <p>Better alternatives are not meaningfully cheaper.</p>
                        </div>
                        <div className="result-actions">
                            <button className="success-btn">Buy Now</button>
                            <button className="secondary-btn">Show Cheaper Option</button>
                            <button className="danger-btn">Don't Buy</button>
                            <button className="secondary-btn" data-go="app">Analyze Another</button>
                        </div>
                  <button
                    onClick={close}
                    className="text-sm text-gray-500 pt-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}