import React, { useState } from 'react';
import Header from '../components/Header';
import MobileNavigation from '../components/MobileNavigation';
import { useAuth } from '../contexts/AuthContext';
import useTheme from '../hooks/useTheme';
import { requestNotificationPermission, checkNotificationSupport } from '../utils/notifications';
import { clearUserData } from '../utils/localStorage';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return Notification.permission === 'granted';
  });
  
  const handleToggleNotifications = async () => {
    if (!checkNotificationSupport()) {
      toast({
        title: "Notifications Not Supported",
        description: "Your browser does not support notifications.",
        variant: "destructive",
      });
      return;
    }
    
    if (notificationsEnabled) {
      toast({
        title: "Notifications",
        description: "To disable notifications, please use your browser settings.",
      });
      return;
    }
    
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      toast({
        title: "Notifications Enabled",
        description: "You will now receive medication reminders.",
      });
    } else {
      toast({
        title: "Notifications Disabled",
        description: "You will not receive medication reminders.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      clearUserData(); // Clear local storage data
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pb-20 sm:pb-0">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold font-display text-gray-900 dark:text-white mb-6">Settings</h1>
            
            {currentUser && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentUser.photoURL || undefined} alt="Profile picture" />
                      <AvatarFallback>
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{currentUser.displayName || 'User'}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Sign Out</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Your medication data will be saved, but you'll need to sign in again to access it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout}>Sign Out</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            )}
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive medication reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive alerts when it's time to take your medication
                    </p>
                  </div>
                  <Switch
                    id="enable-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About PillPal</CardTitle>
                <CardDescription>Application information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Version</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1.0.0</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Privacy Policy</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your medication data is stored securely and never shared with third parties.
                    When offline, your data is stored locally on your device. When online, it's synced with your account.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium">Support</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    For help or feedback, please contact: support@pillpal-app.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
};

export default Settings;
