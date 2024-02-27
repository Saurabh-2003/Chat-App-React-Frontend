import React from 'react';

const Loading = () => {
  return (
    <div className="h-full mt-auto animate-pulse py-2 w-full  ">
     {[...Array(12)].map((_, index) => (
            <div key={index} className="h-8 mb-4 w-2/5 bg-gray-300 even:ml-auto even:rounded-tl-none odd:rounded-br-none rounded-full "/>
      ))}
      <div className='flex border py-2  px-4 rounded-full gap-x-4 w-full'>
        <div className='h-10 w-10 rounded-full bg-gray-300'></div>
        <div className='h-10 flex-grow rounded-full bg-gray-300'></div>
        <div className='h-10 w-10 rounded-full bg-gray-300'></div>
      </div>
    </div>
  );
}

export default Loading;
