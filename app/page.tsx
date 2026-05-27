import Navbar from "./components/Navbar"
import "./styles.css"
import { createClient } from './utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Home() {

  const cookieStore = await cookies()
  const supabase = createClient()

  //console.log(await supabase.from("Users").insert({email:"a",password:"b"}))

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

      <section className="screen auth-screen" id="login" aria-label="Login">
        <div className="auth-card">
          <p className="eyebrow">Login</p>
          <h2>Enter DECIDE.</h2>
          <label>Name
            <input id="loginName" type="text" autoComplete="name" placeholder="Murat"/>
          </label>
          <label>Email
            <input id="loginEmail" type="email" autoComplete="email" placeholder="you@example.com"/>
          </label>
          <label>Password
            <input id="loginPassword" type="password" autoComplete="current-password" placeholder="••••••••"/>
          </label>
          <button className="primary-btn full" id="loginButton">Login</button>
          <p className="auth-note" id="loginStatus">Supabase-ready. Mock login works until keys are added.</p>
        </div>
      </section>

      <section className="screen workspace-screen" id="app" aria-label="Decision workspace">
        <div className="workspace-head">
          <p className="eyebrow">Decision workspace</p>
          <h2>Hello, <span id="userName">Murat</span></h2>
          <p>Add a photo or product link. Your backend can plug into this exact step later.</p>
        </div>

        <div className="analyze-layout">
          <div className="analyze-card">
            <label>Product photo
              <input id="productImage" className="file-input" type="file" accept="image/*"/>
            </label>
            <label className="upload-box" htmlFor="productImage">
              <span id="uploadText">Tap to upload product photo</span>
              <small>JPG, PNG, or phone screenshot</small>
              <img id="imagePreview" alt=""/>
            </label>
            <label>Product link
              <input id="productLink" type="url" inputMode="url" placeholder="https://example.com/product"/>
            </label>
            <button className="primary-btn full" id="analyzeButton">Analyze</button>
          </div>

          <aside className="backend-card">
            <p className="eyebrow">Backend handoff</p>
            <h3>Ready to connect</h3>
            <div className="handoff-row"><span>Auth</span><strong>Supabase</strong></div>
            <div className="handoff-row"><span>Upload</span><strong>Product image</strong></div>
            <div className="handoff-row"><span>Analyze</span><strong>Backend API</strong></div>
            <p className="backend-note">Frontend sends image/link. Backend returns score, verdict, reasons, and alternatives.</p>
          </aside>
        </div>
      </section>

      <section className="screen" id="loading" aria-label="Loading">
        <div className="loading-card">
          <div className="orb"></div>
          <h2>Analyzing</h2>
          <div className="steps">
            <div className="step active">Reading product</div>
            <div className="step active">Checking price</div>
            <div className="step active">Comparing alternatives</div>
            <div className="step">Preparing answer</div>
          </div>
        </div>
      </section>

      <section className="screen result-screen" id="result" aria-label="Result">
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
            <button className="danger-btn">{"Don\'t Buy"}</button>
            <button className="secondary-btn" data-go="app">Analyze Another</button>
          </div>
        </div>
      </section>
    </main>
      </div>
    </div>
  );
}
