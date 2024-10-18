#!/bin/bash

DIRS=(
  "./applications/confs/nginx/certs/*"
  "./applications/confs/nginx/conf.d/*"
  "./applications/confs/sftp/*"
  "./applications/data"
)

# Loop through each directory
for DIR in "${DIRS[@]}"; do
  # Check if the directory exists
  if [ -d "$DIR" ]; then
    # Remove all folders within the specified directory
    find "$DIR" -mindepth 1 -exec rm -r -rf {} +
    echo "All folders in $DIR have been removed."
  else
    echo "Directory $DIR does not exist."
  fi
done