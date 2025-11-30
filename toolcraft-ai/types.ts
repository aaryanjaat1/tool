import React from 'react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
}

export type CalcResult = {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
};