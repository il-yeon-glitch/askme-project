function QACard({ question }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400">Q</span>
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
