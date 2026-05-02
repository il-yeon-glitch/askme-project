import { useState } from 'react';

function QuestionForm({ onSubmit }) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        
        setSubmitting(true);
        await onSubmit(content.trim());
        setContent('');
        setSubmitting(false);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="익명으로 질문을 남겨보세요 (최대 300자)"
                maxLength={300}
                rows={4}
                className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{content.length} / 300</span>
                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="bg-indigo-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition"
                >
                    {done ? '전송 완료!' : '질문 보내기'}
                </button>
            </div>
        </form>
    );
}

export default QuestionForm;
