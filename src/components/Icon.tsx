import React from 'react';

export interface Props {
  icon: string;
  className?: string;
}

const Icon: React.FC<Props> = ({ icon, className }) => (
  <i className={`fas fa-${icon} ${className || ''}`} />
)

export default Icon;

