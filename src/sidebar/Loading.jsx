
const Loading = ({ count = 4 }) => {
  const loadingItems = Array.from({ length: count }, (_, index) => (
    <div key={index} className="animate-pulse flex items-center text-slate-600 justify-between p-4 border-b border-gray-200">
      <div className="initial-circle bg-gray-300 rounded-full h-12 w-12"></div>
      <div className="ml-4 flex-grow h-8 bg-gray-300 rounded-md"></div>
    </div>
  ));

  return (
    <div className='h-full flex flex-col'>
      {loadingItems}
    </div>
  );
};

export default Loading;
