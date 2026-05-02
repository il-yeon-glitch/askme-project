import { useState } from 'react';
import AnswerForm from './AnswerForm';

function QuestionItem({ question, onAnswer, onDelete }) {
    const [showForm, setShowForm] = useState(false);

    function handleSubmit(content) {
        onAnswer(question.id, content);
        setShowForm(false);
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-gray-700 flex-1">{question.content}</p>
                <div className="flex items-center gap-2 shrink-0">
                    {!question.isAnswered && (
                        <button
                            onClick={() => setShowForm(v => !v)}
                            className="text-xs px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                        >
                            답변하기
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(question.id)}
                        className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {question.isAnswered && question.answer && (
                <div className="border-t pt-3 space-y-1">
                    <span className="text-xs font-semibold text-emerald-500">A</span>
                    <p className="text-sm text-gray-800">{question.answer.content}</p>
                </div>
            )}

            {showForm && (
                <AnswerForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}

export default QuestionItem;
