import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ ok: false }))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>AskMe</h1>
      <p>서버 상태: {status ? (status.ok ? '✅ 연결됨' : '❌ 오류') : '확인 중...'}</p>
    </div>
  )
}

export default App
