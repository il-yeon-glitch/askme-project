import { useState } from 'react';

// status: 'idle' | 'sending' | 'success' | 'error'
function QuestionForm({ onSubmit }) {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const isSending = status === 'sending';

    function handleChange(e) {
        const value = e.target.value;
        if (value.length <= 300) {
            setContent(value);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim() || isSending) return; // 중복 클릭 방지

        setStatus('sending');
        setErrorMessage('');

        try {
            await onSubmit(content.trim());
            setContent('');
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000); // 3초 후 복원
        } catch {
            setStatus('error');
            setErrorMessage('전송에 실패했습니다. 다시 시도해주세요.');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <textarea
                value={content}
                onChange={handleChange}
                placeholder="익명으로 질문을 남겨보세요 (최대 300자)"
                rows={6}
                disabled={isSending}
                className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50 disabled:text-gray-400 transition"
            />

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{content.length} / 300</span>
                <button
                    type="submit"
                    disabled={isSending || !content.trim()}
                    className="flex items-center gap-2 bg-indigo-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition"
                >
                    {isSending && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {isSending ? '전송 중...' : '질문 보내기'}
                </button>
            </div>

            {status === 'success' && (
                <p className="text-green-600 bg-green-50 px-4 py-2 rounded-xl text-sm text-center animate-fade-in">
                    질문이 전송되었습니다! ✓
                </p>
            )}
            {status === 'error' && (
                <p className="text-red-500 bg-red-50 px-4 py-2 rounded-xl text-sm text-center">
                    {errorMessage}
                </p>
            )}
        </form>
    );
}

export default QuestionForm;
