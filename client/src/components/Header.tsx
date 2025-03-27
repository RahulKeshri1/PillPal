import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import useTheme from '../hooks/useTheme';
import { BellIcon, SunIcon, MoonIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [location] = useLocation();
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary-600 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.979 7.003c-.05-1.028-.458-1.949-1.146-2.639-.689-.689-1.611-1.098-2.639-1.146C15.643 3.164 14.117 3 12 3s-3.643.164-4.194.218c-1.028.05-1.949.458-2.639 1.146-.689.689-1.098 1.611-1.146 2.639C4.012 7.498 3.96 8.398 3.96 9c0 .604.051 1.504.062 1.997.05 1.028.458 1.949 1.146 2.639.689.689 1.611 1.098 2.639 1.146.551.054 2.077.218 4.194.218s3.643-.164 4.194-.218c1.028-.05 1.949-.458 2.639-1.146.689-.689 1.098-1.611 1.146-2.639.011-.493.062-1.394.062-1.997-.001-.602-.052-1.502-.063-1.997zM6 8.5a.5.5 0 1 1 1 0v7a.5.5 0 1 1-1 0v-7zm2.5 0a.5.5 0 1 1 1 0v7a.5.5 0 1 1-1 0v-7zm2.5 0a.5.5 0 1 1 1 0v7a.5.5 0 1 1-1 0v-7zm2.5 0a.5.5 0 1 1 1 0v7a.5.5 0 1 1-1 0v-7zm2.5 0a.5.5 0 1 1 1 0v7a.5.5 0 1 1-1 0v-7z"/>
              </svg>
              <Link href="/">
                <span className="ml-2 text-xl font-bold font-display cursor-pointer">PillPal</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${location === '/' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/medications">
                <a className={`${location === '/medications' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Medications
                </a>
              </Link>
              <Link href="/history">
                <a className={`${location === '/history' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  History
                </a>
              </Link>
              <Link href="/settings">
                <a className={`${location === '/settings' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Settings
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="ml-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="View notifications"
            >
              <BellIcon className="h-5 w-5" />
            </Button>
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-3 relative">
                    <Avatar>
                      <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} />
                      <AvatarFallback>
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.displayName || currentUser.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" asChild className="ml-3">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" className="inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200">
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
