'use client';

import React from 'react';
import { Hero } from '@/components/home/Hero';
import { StudyToolkit } from '@/components/home/StudyToolkit';

export default function Home() {
  return (
    <div className="space-y-16 animate-in fade-in-50 duration-300">
      <Hero />
      <StudyToolkit />
    </div>
  );
}
