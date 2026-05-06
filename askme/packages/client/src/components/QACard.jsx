import { useState } from 'react';

const LIKED_KEY = 'askme_liked';

function getLiked() {
    try {
        return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]');
    } catch {
        return [];
    }
}

function setLiked(ids) {
    localStorage.setItem(LIKED_KEY, JSON.stringify(ids));
}

function QACard({ question, onLike }) {
    const [liked, setLikedState] = useState(() => getLiked().includes(question.id));
    const [likeCount, setLikeCount] = useState(question.likeCount ?? 0);

    async function handleLike() {
        if (liked) return;

        const result = await onLike(question.id);
        if (result != null) {
            setLikeCount(result);
            const ids = getLiked();
            setLiked([...ids, question.id]);
            setLikedState(true);
        }
    }

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
            <div className="flex justify-end pt-1">
                <button
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-colors ${
                        liked
                            ? 'bg-rose-100 text-rose-400 cursor-default'
                            : 'bg-gray-100 text-gray-400 hover:bg-rose-100 hover:text-rose-400'
                    }`}
                >
                    <span>{liked ? '♥' : '♡'}</span>
                    <span>{likeCount}</span>
                </button>
            </div>
        </div>
    );
}

export default QACard;
