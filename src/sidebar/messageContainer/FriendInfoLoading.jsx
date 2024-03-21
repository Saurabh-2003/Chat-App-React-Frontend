export default function () {
    return (
        <div className="flex bg-gray-800 items-center justify-between py-4 px-4 max-sm:px-6 shadow-md animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
            <div className="w-20 h-4 bg-gray-400 rounded"></div>
          </div>
          <div>
            <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      );
}