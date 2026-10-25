import React from 'react';
import UserGuideWrapper from '../modules/user-guide/UserGuideWrapper';
import { SearchPage } from '../modules/user-guide/pages/SearchPage';

/**
 * Route /services:
 * Directly connected to Abeon / User Guide
 * Uses the WanderWise global navbar without iframes.
 */
export default function ServicesPage() {
  return (
    <UserGuideWrapper>
      <SearchPage />
    </UserGuideWrapper>
  );
}
