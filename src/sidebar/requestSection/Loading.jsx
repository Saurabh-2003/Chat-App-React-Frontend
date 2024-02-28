import React from 'react';

const SkeletonLoadingItem = () => {
  return (
    <div className="animate-pulse flex justify-between items-center py-2">
      <div className="w-1/3 h-6 bg-gray-300 rounded-md"></div>
      <div className="icons-here flex">
        <div className="accept-button bg-gray-300 rounded-md mr-2 w-10 h-10"></div>
        <div className="decline-button bg-gray-300 rounded-md w-10 h-10"></div>
      </div>
    </div>
  );
};

const Loading = ({ count }) => {
  const loadingItems = Array.from({ length: count }, (_, index) => <SkeletonLoadingItem key={index} />);
  
  return (
    <section>
      {/* Skeleton Loading */}
      {loadingItems}
    </section>
  );
};

export default Loading;
