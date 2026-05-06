import QACard from './QACard';

function QAList({ questions, onLike }) {
    if (questions.length === 0) {
        return (
            <p className="text-center text-sm text-gray-400 py-8">
                아직 답변된 질문이 없습니다.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500">답변 완료된 질문</h2>
            {questions.map(q => (
                <QACard key={q.id} question={q} onLike={onLike} />
            ))}
        </div>
    );
}

export default QAList;
