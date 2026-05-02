import { useState } from 'react';
import QuestionFilter from '../components/QuestionFilter';
import QuestionList from '../components/QuestionList';

const dummyQuestions = [
    { id: 1, content: '좋아하는 음식이 뭐예요?', isAnswered: true, answer: { content: '저는 피자를 좋아해요!' } },
    { id: 2, content: '취미가 뭔가요?', isAnswered: false, answer: null },
    { id: 3, content: '어디서 일하세요?', isAnswered: false, answer: null },
];

function DashboardPage() {
    const [filter, setFilter] = useState('all');
    const [questions, setQuestions] = useState(dummyQuestions);

    const filtered = questions.filter(q => {
        if (filter === 'unanswered') return !q.isAnswered;
        if (filter === 'answered') return q.isAnswered;
        return true;
    });

    function handleAnswer(id, content) {
        setQuestions(prev =>
            prev.map(q => q.id === id ? { ...q, isAnswered: true, answer: { content } } : q)
        );
    }

    function handleDelete(id) {
        setQuestions(prev => prev.filter(q => q.id !== id));
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto py-10 px-4 space-y-6">
                <h1 className="text-xl font-bold text-gray-800">내 질문함</h1>
                <QuestionFilter filter={filter} onChange={setFilter} />
                <QuestionList questions={filtered} onAnswer={handleAnswer} onDelete={handleDelete} />
            </div>
        </div>
    );
}

export default DashboardPage;
