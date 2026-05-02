import { useState } from 'react';

function QuestionForm({ onSubmit }) {
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const isOver = content.length > 300;

    function handleChange(e) {
        const value = e.target.value;
        if (value.length <= 300) {
            setContent(value);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim() || isOver) return;

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
                onChange={handleChange}
                placeholder="익명으로 질문을 남겨보세요 (최대 300자)"
                rows={6}
                className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{content.length} / 300</span>
                    {isOver && (
                        <span className="text-xs text-red-500">300글자를 넘겼습니다!</span>
                    )}
                </div>
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
