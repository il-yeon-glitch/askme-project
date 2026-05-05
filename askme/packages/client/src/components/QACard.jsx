function QACard({ question }) {
    return (
        <div className={`rounded-2xl shadow-sm p-5 space-y-3 ${question.isPinned ? 'bg-indigo-50 border border-indigo-200' : 'bg-white'}`}>
            <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-indigo-400">Q</span>
                    {question.isPinned && <span className="text-xs text-indigo-400">📌</span>}
                </div>
                <p className="text-sm text-gray-700">{question.content}</p>
            </div>
            {question.answer && (
                <div className="border-t pt-3 space-y-1">
                    <span className="text-xs font-semibold text-emerald-500">A</span>
                    <p className="text-sm text-gray-800">{question.answer.content}</p>
                </div>
            )}
        </div>
    );
}

export default QACard;
