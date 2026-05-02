function OwnerHeader({ user }) {
    return (
        <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto text-2xl font-bold text-indigo-500">
                {user.displayName[0]}
            </div>
            <h1 className="text-xl font-bold text-gray-800">{user.displayName}</h1>
            <p className="text-sm text-gray-400">@{user.username}</p>
            <p className="text-sm text-gray-500">익명으로 질문을 남겨보세요!</p>
        </div>
    );
}

export default OwnerHeader;
