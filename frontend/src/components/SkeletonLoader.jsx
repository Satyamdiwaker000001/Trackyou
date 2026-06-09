import React from 'react';
import './SkeletonLoader.css';

export function SkeletonText({ width = '100%', height = '1rem', className = '' }) {
  return <div className={`skeleton skeleton-text ${className}`} style={{ width, height }}></div>;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`skeleton-card ${className}`}>
      <div className="skeleton-card-header">
        <SkeletonText width="60%" height="1.2rem" />
      </div>
      <div className="skeleton-card-body">
        <SkeletonText width="100%" />
        <SkeletonText width="80%" />
      </div>
      <div className="skeleton-card-footer">
        <SkeletonText width="40%" height="0.8rem" />
      </div>
    </div>
  );
}

export function SkeletonMetricCard({ className = '' }) {
  return (
    <div className={`skeleton-metric-card ${className}`}>
      <SkeletonText width="40px" height="40px" className="rounded-full" />
      <div style={{ marginTop: '16px' }}>
        <SkeletonText width="80%" height="1.5rem" />
        <SkeletonText width="50%" height="0.8rem" style={{ marginTop: '8px' }} />
      </div>
    </div>
  );
}
