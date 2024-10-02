#!/bin/bash

# Check if Docker is installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Error: Docker is not installed." >&2
  exit 1
fi

# Create docker group if it doesn't exist
if ! getent group docker > /dev/null 2>&1; then
  echo "Creating 'docker' group..."
  sudo groupadd docker
else
  echo "'docker' group already exists."
fi

# Add current user to the docker group
USER=$(whoami)
echo "Adding user '$USER' to the 'docker' group..."
sudo usermod -aG docker $USER

# Restart Docker service
echo "Restarting Docker service..."
sudo systemctl restart docker

# Display instructions to log out and back in
echo "Please log out and log back in for group changes to take effect."
echo "Alternatively, you can run 'newgrp docker' to apply the changes immediately."

# Test Docker without sudo
echo "Testing Docker permissions..."
if docker ps > /dev/null 2>&1; then
  echo "Docker is running without sudo. Setup complete!"
else
  echo "Docker still requires sudo. Try logging out and back in."
fi