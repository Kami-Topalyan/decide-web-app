// components/navbar-client.tsx

'use client'

import { useState } from "react";
import SignUpModal from "./signup-modal";
import SignInModal from "./signin-modal";

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type Props = {
  userEmail: string | null;
  
};

export default function NavbarClient({
  userEmail,
}: Props) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);


  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()

    await supabase.auth.signOut()

    router.refresh() // refresh server components (navbar updates)
    router.push('/')  // optional redirect
  }

  return (
    <nav className="navbar">
      <header className="topbar flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <button
            className="brand"
            data-go="intro"
            aria-label="Go to intro"
          >
            DECIDE
          </button>

          {userEmail && (
            <p className="text-sm text-gray-400">
              {userEmail}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          {!userEmail ? (
            <>
              <button
                className="font-bold bg-gray-800 p-3 rounded-lg"
                onClick={() => setShowSignup(true)}
              >
                Sign up
              </button>

              <button
                className="font-bold bg-blue-500 p-3 rounded-lg"
                onClick={() => setShowLogin(true)}
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              className="font-bold bg-red-500 p-3 rounded-lg"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <SignUpModal
        open={showSignup}
        onClose={() => {
          setShowSignup(false);
          setShowLogin(false);
        }}
        router={router}
      />

      <SignInModal
        open={showLogin}
        onClose={() => {
          setShowSignup(false);
          setShowLogin(false);
        }}
        router={router}
      />
    </nav>
  );
}