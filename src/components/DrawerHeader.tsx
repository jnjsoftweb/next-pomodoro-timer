import React from 'react';
import { X } from "lucide-react";

interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ title, onClose, children }) => {
  return (
    <div className="flex justify-between items-center mb-4 bg-[#2a3038] p-4 rounded-t-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
      <button onClick={onClose} className="p-1 rounded-full shadow-dark-neumorphic-button">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
};

export default DrawerHeader;