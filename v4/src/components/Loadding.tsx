'use client';
import { Spinner } from 'react-bootstrap';

interface LoadingProps {
  spinnerSize?: 'sm' | undefined;
  containerSize?: 'sm' | 'lg'; // 单独控制容器大小
  isImg?: boolean;
}

export default function Loading({ 
  spinnerSize, 
  containerSize = 'lg', 
  isImg = false 
}: LoadingProps) {
  return (
    <>
      {isImg ? (
        <Spinner animation="border" size={spinnerSize} />
      ) : (
        <div className={containerSize === 'sm' ? '' : 'fs-3 p-5'}>
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </div>
      )}
    </>
  );
}
