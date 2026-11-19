import { useState } from 'react'
import { verifyCredentials } from './auth.js'

export default function Login({ onSuccess }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (checking) return
    setError('')
    setChecking(true)
    try {
      const ok = await verifyCredentials(user, pass)
      if (ok) {
        onSuccess()
      } else {
        setError('Sai tên đăng nhập hoặc mật khẩu.')
      }
    } catch {
      setError('Không kiểm tra được, thử lại sau.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <h1>Ảnh nhóm</h1>
        <p className="login-sub">Đăng nhập để xem và up ảnh</p>
        <label className="login-field">
          <span>Tên đăng nhập</span>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
            autoFocus
            placeholder="Tên đăng nhập"
          />
        </label>
        <label className="login-field">
          <span>Mật khẩu</span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
            placeholder="Mật khẩu"
          />
        </label>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="login-btn"
          disabled={checking || user.trim() === '' || pass === ''}
        >
          {checking ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  )
}
