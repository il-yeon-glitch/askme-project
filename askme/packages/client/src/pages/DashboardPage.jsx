import { useEffect, useState } from 'react';
import QuestionFilter from '../components/QuestionFilter';
import QuestionList from '../components/QuestionList';

function DashboardPage() {
    const [filter, setFilter] = useState('all');
    const [questions, setQuestions] = useState([]);
    const [copied, setCopied] = useState(false);

    async function fetchQuestions() {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/my/questions', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setQuestions(data.questions);
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    const filtered = questions.filter(q => {
        if (filter === 'unanswered') return !q.isAnswered;
        if (filter === 'answered') return q.isAnswered;
        return true;
    });

    async function handleAnswer(id, content) {
        const token = localStorage.getItem('token');
        await fetch(`/api/my/questions/${id}/answer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });
        fetchQuestions();
    }

    function handleCopyLink() {
        const user = JSON.parse(localStorage.getItem('user'));
        const url = `${window.location.origin}/${user.username}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    async function handleDelete(id) {
        if (!window.confirm('질문을 삭제하시겠습니까?')) return;
        const token = localStorage.getItem('token');
        await fetch(`/api/my/questions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchQuestions();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">내 질문함</h1>
                    <button
                        onClick={handleCopyLink}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition"
                    >
                        내 질문함 링크 복사
                    </button>
                </div>
                {copied && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
                        복사되었습니다!
                    </div>
                )}
                <QuestionFilter filter={filter} onChange={setFilter} />
                <QuestionList questions={filtered} onAnswer={handleAnswer} onDelete={handleDelete} />
            </div>
        </div>
    );
}

export default DashboardPage;
