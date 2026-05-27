"use client";

import { useState } from "react";
import Modal from "./modal";
import { createClient } from "../utils/supabase/client";
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function SignInModal({
  open,
  onClose,
  router,
}: {
  open: boolean;
  onClose: () => void;
  router: AppRouterInstance
}) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log(supabase.auth.getUser())

    setLoading(false);


    if (error) {
      setMessage(error.message);
    } else {
        setMessage("Sign in successful!");
        setEmail("");
        setPassword("");
        router.refresh() // refresh server components (navbar updates)
        router.push('/workspace')  // optional redirect
    }
  };
          

  return (
    <Modal open={open} onClose={onClose}>

        <div className="auth-card gap-10 flex flex-col">
            <div className="flex justify-between">
                <p className="eyebrow">Login</p>
                <h2 className="eyebrow text-lg">Enter DECIDE.</h2>
            </div>


            <form onSubmit={handleSignUp}>
                <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", marginBottom: 10, width: "100%" }}
                />

                <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", marginBottom: 10, width: "100%" }}
                />

                <button className="primary-btn full" disabled={loading} type="submit">
                {loading ? "Creating..." : "Sign Up"}
                </button>
            </form>

            <p style={{ marginTop: 10 }}>{message}</p>
        </div>
    </Modal>
  );
}