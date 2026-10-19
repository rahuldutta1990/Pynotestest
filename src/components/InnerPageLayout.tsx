import React from 'react';
import { Outlet } from 'react-router-dom';
import { InnerPageBanner } from './InnerPageBanner';

export const InnerPageLayout: React.FC<{ title?: string; subtitle?: string }> = ({ title, subtitle }) => {
  return (
    <div className="space-y-0">
      <InnerPageBanner title={title} subtitle={subtitle} />
      <div className="pt-8">
        <Outlet />
      </div>
    </div>
  );
};
