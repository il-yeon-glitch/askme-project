import { useState } from 'react';

function AnswerForm({ onSubmit, onCancel }) {
    const [content, setContent] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content.trim());
    }

    return (
        <form onSubmit={handleSubmit} className="border-t pt-3 space-y-2">
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="답변을 입력하세요"
                rows={3}
                className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-xs px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                >
                    취소
                </button>
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="text-xs px-4 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 transition"
                >
                    답변 등록
                </button>
            </div>
        </form>
    );
}

export default AnswerForm;
