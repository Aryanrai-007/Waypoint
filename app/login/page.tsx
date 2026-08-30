'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-glow glow-one" />
      <div className="login-glow glow-two" />
      <section className="login-card">
        <div className="login-brand"><span><Sparkles size={18} /></span> WAYPOINT</div>
        <p className="login-kicker">YOUR PRODUCTIVITY WORKSPACE</p>
        <h1>Plan. Focus.<br /><em>Achieve.</em></h1>
        <p className="login-copy">A calm, intelligent workspace built for every college student — every branch, every stream, every goal.</p>
        <button className="google-button" onClick={signInWithGoogle} disabled={loading}>
          <span className="google-icon">G</span>
          {loading ? 'Connecting…' : 'Continue with Google'}
          <ArrowRight size={17} />
        </button>
        {error && <p className="login-error">{error}</p>}
        <div className="trust-row"><span>Private by design</span><span>•</span><span>Your data stays yours</span></div>
      </section>
    </main>
  )
}
