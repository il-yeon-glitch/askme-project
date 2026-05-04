import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OwnerHeader from '../components/OwnerHeader';
import QuestionForm from '../components/QuestionForm';
import QAList from '../components/QAList';

function UserPage() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(null);

    async function fetchUserData() {
        try {
            const res = await fetch(`/api/questions/${username}/answered`);
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
        fetchUserData();
    }

    useEffect(() => {
        fetchUserData();
    }, [username]);

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
                <QAList questions={questions} />
            </div>
        </div>
    );
}

export default UserPage;
