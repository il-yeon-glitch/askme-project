const tabs = [
    { value: 'all', label: '전체' },
    { value: 'unanswered', label: '미답변' },
    { value: 'answered', label: '답변완료' },
];

function QuestionFilter({ filter, onChange }) {
    return (
        <div className="flex gap-2">
            {tabs.map(tab => (
                <button
                    key={tab.value}
                    onClick={() => onChange(tab.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        filter === tab.value
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default QuestionFilter;
