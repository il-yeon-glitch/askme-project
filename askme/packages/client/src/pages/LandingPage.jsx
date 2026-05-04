import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    // 로그인 state
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 회원가입 state
    const [signupUsername, setSignupUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
    }

    const passwordMismatch = passwordConfirm.length > 0 && signupPassword !== passwordConfirm;

    async function handleSignup(e) {
        e.preventDefault();
        if (passwordMismatch) return;
        setError('');
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: signupUsername, password: signupPassword, displayName }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">AskMe</h1>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                {isLogin ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label>아이디</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label>비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition">
                            로그인
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">아이디</label>
                            <input
                                type="text"
                                value={signupUsername}
                                onChange={e => setSignupUsername(e.target.value)}
                                placeholder="아이디를 입력하세요"
                                className="w-full border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">이름</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="표시될 이름을 입력하세요"
                                className="w-full border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">비밀번호</label>
                            <input
                                type="password"
                                value={signupPassword}
                                onChange={e => setSignupPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full border border-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={e => setPasswordConfirm(e.target.value)}
                                placeholder="비밀번호를 다시 입력하세요"
                                className={`w-full border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${passwordMismatch ? 'border-red-500' : 'border-gray-800'}`}
                            />
                            {passwordMismatch && (
                                <p className="text-xs text-red-500">비밀번호가 일치하지 않습니다</p>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl transition">
                            회원가입
                        </button>
                    </form>
                )}

                <p>
                    {isLogin ? (
                        <>계정이 없으신가요? <button onClick={() => setIsLogin(false)}>회원가입</button></>
                    ) : (
                        <>이미 계정이 있으신가요? <button onClick={() => setIsLogin(true)}>로그인</button></>
                    )}
                </p>
            </div>
        </div>
    );
}

export default LandingPage;
