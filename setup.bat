@echo off
echo Setting up PillPal - Medication Reminder App...
echo ===============================================

:: Create a folder for the app
echo Creating project folder...
mkdir pillpal-app
cd pillpal-app

:: Clone the repository
echo Cloning repository...
git clone https://github.com/your-username/pillpal-app.git .

:: Install dependencies
echo Installing dependencies... (This may take a few minutes)
npm install

:: Create .env file for Firebase configuration
echo Creating Firebase configuration...
echo.
echo Please enter your Firebase configuration details:
echo (You can find these in your Firebase project settings)
echo.

set /p FIREBASE_API_KEY="Enter Firebase API Key: "
set /p FIREBASE_PROJECT_ID="Enter Firebase Project ID: "
set /p FIREBASE_APP_ID="Enter Firebase App ID: "
set /p FIREBASE_MESSAGING_SENDER_ID="Enter Firebase Messaging Sender ID (or press Enter to skip): "

:: Write to .env file
echo Creating .env file...
(
echo VITE_FIREBASE_API_KEY=%FIREBASE_API_KEY%
echo VITE_FIREBASE_PROJECT_ID=%FIREBASE_PROJECT_ID%
echo VITE_FIREBASE_APP_ID=%FIREBASE_APP_ID%
echo VITE_FIREBASE_MESSAGING_SENDER_ID=%FIREBASE_MESSAGING_SENDER_ID%
) > .env

echo.
echo Configuration complete!
echo.

:: Start the development server
echo Starting the application...
echo.
echo Once the server starts, you can access the app at:
echo http://localhost:5000
echo.
echo Press Ctrl+C to stop the server when you're done.

:: Start the dev server
npm run dev

:: Finished
echo.
echo Thank you for using PillPal!
echo If you have any issues, please check the documentation.
