import { Camera } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@astryxdesign/core/Button'
import { Card } from '@astryxdesign/core/Card'
import { Heading } from '@astryxdesign/core/Heading'
import { Text } from '@astryxdesign/core/Text'
import { TextInput } from '@astryxdesign/core/TextInput'
import { VStack } from '@astryxdesign/core/VStack'
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
      <Card width="100%" maxWidth={380} elevation="low">
        <form onSubmit={submit}>
          <VStack gap={4}>
            <div className="login-icon" aria-hidden="true">
              <Camera size={30} />
            </div>
            <div className="login-head">
              <Heading level={1}>Ảnh nhóm</Heading>
              <Text type="supporting">Đăng nhập để xem và up ảnh</Text>
            </div>
            <TextInput
              label="Tên đăng nhập"
              value={user}
              onChange={setUser}
              autoComplete="username"
              hasAutoFocus
              hasAutoCorrect={false}
              enterKeyHint="next"
              width="100%"
            />
            <TextInput
              label="Mật khẩu"
              type="password"
              value={pass}
              onChange={setPass}
              autoComplete="current-password"
              enterKeyHint="go"
              width="100%"
              status={
                error ? { type: 'error', message: error } : undefined
              }
            />
            <Button
              label="Đăng nhập"
              type="submit"
              variant="primary"
              size="lg"
              width="100%"
              isLoading={checking}
              isDisabled={user.trim() === '' || pass === ''}
            />
          </VStack>
        </form>
      </Card>
    </div>
  )
}
