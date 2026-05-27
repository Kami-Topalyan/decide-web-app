"use client";

import { useState } from "react";
import Modal from "./modal";
import { createClient } from "../utils/supabase/client";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function SignUpModal({
  open,
  onClose,
  router
}: {
  open: boolean;
  onClose: () => void;
  router: AppRouterInstance;
}) {
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Sign up successful!");
      setName("")
      setEmail("");
      setPassword("");
      router.refresh() // refresh server components (navbar updates)
      router.push('/workspace')  // optional redirect
    }
  };
          

  return (
    <Modal open={open} onClose={onClose}>
        <div className="screen auth-screen active">
            <div className="auth-card">
        <p className="eyebrow">Login</p>
        <h2>Enter DECIDE.</h2>

        <form onSubmit={handleSignUp}>
            <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", marginBottom: 10, width: "100%" }}
            />

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
        </div>
    </Modal>
  );
}