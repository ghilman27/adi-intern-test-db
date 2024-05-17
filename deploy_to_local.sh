#!/bin/bash

# summary: this script will run cloud_sql_proxy first in the background first before running node js script
# then clean up the background process if the script is stopped abruptly

# Function to clean up background cloud sql proxy processes
cleanup() {
  echo "Stopping cloud_sql_proxy..."
  kill $CLOUD_SQL_PROXY_PID
  wait $CLOUD_SQL_PROXY_PID
}

# Set the trap to catch SIGINT, SIGTERM and other termination signals
trap cleanup EXIT

# Navigate to the script's directory
cd "$(dirname "$0")"

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Run the cloud_sql_proxy
./cloud_sql_proxy \
  -instances=$GCP_CLOUD_SQL_INSTANCE_CONNECTION_NAME=tcp:$DB_PORT \
  -credential_file=$GOOGLE_APPLICATION_CREDENTIALS & CLOUD_SQL_PROXY_PID=$!

# Function to check if cloud_sql_proxy is ready
check_proxy_ready() {
  while ! nc -z localhost $DB_PORT; do
    echo "Waiting for cloud_sql_proxy to be ready..."
    sleep 1
  done
  echo "cloud_sql_proxy is ready"
}

# Wait for the Cloud SQL Proxy to be ready
check_proxy_ready

# Run the Node.js script
node index.js

# Wait for the Node.js application to finish, then the trap will clean up the proxy
wait $!