# SelfPress

SelfPress is a multi-instance WordPress management system that allows users to manage and deploy isolated WordPress installations efficiently using Docker containers. It simplifies WordPress multi-site management by integrating with Docker, Nginx, and MySQL, providing a streamlined interface for handling installations, settings, and configurations.

## Features

- **Multi-instance WordPress management**: Isolate each WordPress installation in its own Docker container.
- **Centralized MySQL database management**: Use a single MySQL instance for multiple WordPress installations, each with its own database.
- **Automated Nginx configuration**: Assign unique domains to each installation with separate Nginx configuration files.
- **Docker-based environment**: Deploy WordPress installations in a containerized environment to ensure isolation and flexibility.
- **Customizable settings**: Easily manage WordPress settings and Docker parameters.
- **Domain management**: Add and manage domains for each WordPress installation with status monitoring (e.g., DNS status).

## Prerequisites

- **Docker**: Make sure you have Docker installed. You can install it by following the official [Docker documentation](https://docs.docker.com/get-docker/).
- **Bun.sh**: For running the SelfPress manager. [Get Bun](https://bun.sh/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/SelfPress.git
   cd SelfPress
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**: Copy `.env.default` to `.env` in the root directory and customize as you prefer.

4. **Set up Prisma DB**:
   ```bash
   bunx prisma db push
   bunx prisma db generate
   ```

5. **Start the Dev server**:
   ```bash
   bun dev
   ```

## Usage

### Create a New WordPress Installation

The SelfPress manager provides an interface to deploy new WordPress instances. You can create new WordPress installations with a unique database and separate configuration files.

### Managing WordPress Installations

- **Domains**: Assign unique domains to each WordPress installation and monitor DNS status.
- **Settings**: Customize WordPress and Docker container settings directly from the interface.

### API

SelfPress includes an API to automate and interact with WordPress deployments. For details on the API endpoints, refer to the `/api` documentation.

## Contributing

Feel free to fork the project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.