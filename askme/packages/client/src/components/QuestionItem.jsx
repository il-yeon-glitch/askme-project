import { useState } from 'react';
import AnswerForm from './AnswerForm';

function QuestionItem({ question, onAnswer, onDelete, onPin, onEditAnswer }) {
    const [showForm, setShowForm] = useState(false);
    const [showAnswerEdit, setShowAnswerEdit] = useState(false);
    const [answerEditContent, setAnswerEditContent] = useState(question.answer?.content ?? '');

    function handleAnswerSubmit(content) {
        onAnswer(question.id, content);
        setShowForm(false);
    }

    function handleAnswerEditSubmit(e) {
        e.preventDefault();
        if (!answerEditContent.trim()) return;
        onEditAnswer(question.id, answerEditContent.trim());
        setShowAnswerEdit(false);
    }

    function handleAnswerEditCancel() {
        setAnswerEditContent(question.answer?.content ?? '');
        setShowAnswerEdit(false);
    }

    return (
        <div className={`rounded-2xl shadow-sm p-5 space-y-3 ${question.isPinned ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                    {question.isPinned && (
                        <span className="text-indigo-400 text-xs mt-0.5 shrink-0">📌</span>
                    )}
                    <p className="text-sm text-gray-700">{question.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => onPin(question.id)}
                        className={`text-xs px-3 py-1 rounded-lg transition ${
                            question.isPinned
                                ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        {question.isPinned ? '고정 해제' : '고정'}
                    </button>
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
                <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-500">A</span>
                        <button
                            onClick={() => setShowAnswerEdit(v => !v)}
                            className="text-xs px-3 py-1 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 transition"
                        >
                            답변 수정
                        </button>
                    </div>
                    {showAnswerEdit ? (
                        <form onSubmit={handleAnswerEditSubmit} className="space-y-2">
                            <textarea
                                value={answerEditContent}
                                onChange={e => setAnswerEditContent(e.target.value)}
                                rows={3}
                                className="w-full resize-none border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={handleAnswerEditCancel}
                                    className="text-xs px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={!answerEditContent.trim()}
                                    className="text-xs px-4 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 transition"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-800">{question.answer.content}</p>
                    )}
                </div>
            )}

            {showForm && (
                <AnswerForm onSubmit={handleAnswerSubmit} onCancel={() => setShowForm(false)} />
            )}
        </div>
    );
}

export default QuestionItem;
