'use client';

import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'lg'; // 可选参数，限制只能是 sm 或 lg
}

export default function Loading({ size = 'lg' }: LoadingProps) {
  return (
    <div className={size === 'sm' ? '' : 'fs-3 p-5'}>
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </div>
  );
}
