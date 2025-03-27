import React from 'react';
import { Link, useLocation } from 'wouter';
import { HomeIcon, PillIcon, ClipboardListIcon, SettingsIcon } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const [location] = useLocation();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-4 h-16">
        <Link href="/">
          <a className={`flex flex-col items-center justify-center ${location === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/medications">
          <a className={`flex flex-col items-center justify-center ${location === '/medications' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <PillIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Meds</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`flex flex-col items-center justify-center ${location === '/history' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <ClipboardListIcon className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={`flex flex-col items-center justify-center ${location === '/settings' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <SettingsIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
