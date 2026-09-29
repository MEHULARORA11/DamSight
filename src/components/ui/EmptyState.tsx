import React from 'react';
import { Database } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = Database,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-600 text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-600 rounded-md hover:opacity-90 active:scale-95 transition-all duration-150"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
