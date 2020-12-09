#!/usr/bin/env bash

set -e

SCREEN_NAME='bachelorStudy'
HTTP_USER='www-data'
PI_USER='pi'
APP_PATH='/var/www/bachelor_study'
LOGGER_PATH='/var/www/html/logger.php'
DATABASENAME='bachelorstudy'
DATABASEUSER='bachelorstudy'

# Kill any existing session first
if screen -list | grep -q "${SCREEN_NAME}"; 
then
    screen -X -S "${SCREEN_NAME}" quit
fi

# Update files
sudo chown -R ${PI_USER}:${PI_USER} ${APP_PATH}
# sudo -Hu ${HTTP_USER} git pull
git pull
sudo chown -R ${HTTP_USER}:${HTTP_USER} ${APP_PATH}

# Install dependencies
sudo -Hu ${HTTP_USER} npm install

# Copy logger and enter details
sudo cp "${APP_PATH}/logger.php" "${LOGGER_PATH}"
sudo chown ${HTTP_USER}:${HTTP_USER} "${LOGGER_PATH}"
sudo sed --in-place "s/DATABASENAME/${DATABASENAME}/" "${LOGGER_PATH}"
sudo sed --in-place "s/DATABASEUSER/${DATABASEUSER}/" "${LOGGER_PATH}"
read -e -p "Please enter the database password: " DATABASEPASSWORD
sudo sed --in-place "s/DATABASEPASSWORD/${DATABASEPASSWORD}/" "${LOGGER_PATH}"


# Create new session and start node server
sudo screen -dmS "${SCREEN_NAME}"
sudo screen -S  "${SCREEN_NAME}" -X stuff "cd ${APP_PATH}; until sudo -Hu ${HTTP_USER} node app; do echo 'Crashed with exit code $?. Restarting...'; sleep 10s; done\n"
