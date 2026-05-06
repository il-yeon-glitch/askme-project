import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OwnerHeader from '../components/OwnerHeader';
import QuestionForm from '../components/QuestionForm';
import QAList from '../components/QAList';

const sortTabs = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
];

function UserPage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState('latest');

    async function fetchUserData(currentSort) {
        try {
            const res = await fetch(`/api/questions/${username}/answered?sort=${currentSort}`);
            if (!res.ok) {
                setError('존재하지 않는 사용자입니다');
                return;
            }
            const data = await res.json();
            setUser(data.user);
            setQuestions(data.questions);
        } catch {
            setError('데이터를 불러오지 못했습니다');
        }
    }

    async function submitQuestion(content) {
        await fetch('/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, ownerId: user.id }),
        });
        fetchUserData(sort);
    }

    async function handleLike(questionId) {
        try {
            const res = await fetch(`/api/questions/${questionId}/like`, { method: 'POST' });
            if (!res.ok) return null;
            const data = await res.json();
            return data.likeCount;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        fetchUserData(sort);
    }, [username, sort]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-400">불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
                <OwnerHeader user={user} />
                <QuestionForm onSubmit={submitQuestion} />
                <div className="flex justify-end gap-1">
                    {sortTabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setSort(tab.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                                sort === tab.value
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <QAList questions={questions} onLike={handleLike} />
            </div>
        </div>
    );
}

export default UserPage;
