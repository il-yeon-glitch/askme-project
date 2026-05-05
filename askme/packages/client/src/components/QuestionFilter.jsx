const filterTabs = [
    { value: 'all', label: '전체' },
    { value: 'unanswered', label: '미답변' },
    { value: 'answered', label: '답변완료' },
];

const sortTabs = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
];

function QuestionFilter({ filter, onChange, sort, onSortChange }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                {filterTabs.map(tab => (
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
            <div className="flex gap-1">
                {sortTabs.map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => onSortChange(tab.value)}
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
        </div>
    );
}

export default QuestionFilter;
