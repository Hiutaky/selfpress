# SelfPress

SelfPress is a multi-instance WordPress management system that allows users to manage and deploy isolated WordPress installations efficiently using Docker containers. It simplifies WordPress multi-site management by integrating with Docker, Nginx, and MySQL, providing a streamlined interface for handling installations, settings, and configurations.

## Features

- **Multi-instance WordPress management**: Isolate each WordPress installation in its own Docker container.
- **Centralized MySQL database management**: Use a single MySQL instance for multiple WordPress installations, each with its own database.
- **Automated Nginx configuration**: Assign unique domains to each installation with separate Nginx configuration files.
- **Docker-based environment**: Deploy WordPress installations in a containerized environment to ensure isolation and flexibility.
- **Customizable settings**: Easily manage WordPress settings and Docker parameters.
- **Domain management**: Add and manage domains for each WordPress installation with status monitoring (e.g., DNS status).
- **Native Cloudflare Integration**: Connect your Cloudflare account and explore your available Zones.
- **SFTP server**: Selfpress comes with a powerful and automated SFTP Server, each Wordpress as its account.
- **WP Cli**: Manage your Wordpress using WP Cli inside the Panel without using SSH.
- **PhpMyAdmin**: Access your databases by using the Powerful PhpMyAdmin interface.
- **Redis Cache**: SelfPress's native Redis Integration provides you a fast and ready to use Redis Cache Server and plugin to manage it easily directly from WordPress.

## Prerequisites

- **Docker**: Make sure you have Docker installed. You can install it by following the official [Docker documentation](https://docs.docker.com/get-docker/).
- **Bun.sh**: For running the SelfPress manager. [Get Bun](https://bun.sh/)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Hiutaky/selfpress.git
   cd selfpress
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

### Create the Admin Account

To get started, you'll need to create an Administrator Account to secure your dashboard. Once that's done, you can configure the main domain for your panel. This domain can only be linked using the Cloudflare API. As part of the setup, you'll also need to generate Origin Certificates to ensure a secure connection for both the panel and the WordPress installations.

Each WordPress installation you deploy will automatically receive a custom subdomain based on the main domain you've assigned to the panel, making it instantly accessible. Later, you'll have the option to link a different main domain if needed.

For example, if your panel domain is panel.mydomain.ltd, new WordPress installations will be placed under the same main domain, such as wp_0000.mydomain.ltd.

These subdomains will automatically inherit the Origin Certificates from Cloudflare, ensuring they are secure and ready to use right away.

### Create a New WordPress Installation

The SelfPress manager provides an interface to deploy new WordPress instances. You can create new WordPress installations with a unique database and separate configuration files. Inside the application page you can check all the most important details about your installation, like: DB Access, SFTP connection, Admin login data, info about Docker Container and a useful WP Cli terminal. Also you'll be able to perform several actions as: Restart the Docker Container, Fast Admin Login and access a Log.

### Managing WordPress Installations

- **Domains**: By using the native Cloudflare integration, creating and assigning new Domains is super-easy. By using the guided interface you can assign or create new subdomain and domain, manage Origin Certificates and automatially setup the needed Nginx Configurations. 
- **Settings**: Customize WordPress and Docker container settings directly from the interface.

### API

Soon.

## Contributing

Feel free to fork the project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
