import QuestionItem from './QuestionItem';

function QuestionList({ questions, onAnswer, onDelete, onPin, onEditAnswer }) {
    if (questions.length === 0) {
        return (
            <p className="text-center text-sm text-gray-400 py-8">질문이 없습니다.</p>
        );
    }

    return (
        <div className="space-y-4">
            {questions.map(q => (
                <QuestionItem key={q.id} question={q} onAnswer={onAnswer} onDelete={onDelete} onPin={onPin} onEditAnswer={onEditAnswer} />
            ))}
        </div>
    );
}

export default QuestionList;
