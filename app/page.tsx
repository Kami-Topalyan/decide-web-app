import Navbar from "./components/Navbar"
import "./styles.css"
import { createClient } from './utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {
  return (
    <div className="">
      <div className="app-shell">
      <Navbar></Navbar>
      <main>
      <section className="screen active intro-screen" id="intro" aria-label="Intro">
        <div className="intro-copy">
          <p className="eyebrow">AI buying decision</p>
          <h1>Should I buy this?</h1>
          <p>Upload what you want. DECIDE gives one clear answer.</p>
          <button className="primary-btn" data-go="login">Start</button>
        </div>
        <div className="mini-result">
          <span className="status-dot"></span>
          <div>
            <small>Example verdict</small>
            <strong>Buy · 87%</strong>
          </div>
        </div>
      </section>
    </main>
      </div>
    </div>
  );
}
