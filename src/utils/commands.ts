import { ContainerActions } from "~/server/routers/docker";

export type CreateWordPressCMD = {
  uniqueName: string;
  networkName: string;
  port: string | number;
  mysqlContainer: string;
  mysqlPort: string | number;
  dbUser: string;
  dbPassword: string;
  dbName: string;
};
export type InstallWpCliCMD = {
  uniqueName: string;
};
export type SetupWpCliCMD = {
  uniqueName: string;
  domain: number | string;
  siteName: string;
  siteDescription: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  redisContainer: string;
};
export type CreateMysqlCMD = {
  mysqlName: string;
  networkName: string;
  mysqlPassword: string;
  mysqlPort: string | number;
};
export type CheckDbCMD = {
  mysqlName: string;
  mysqlPassword: string;
  dbName: string;
};
export type CreateDbAndUserCMD = {
  mysqlName: string;
  mysqlPassword: string;
  dbName: string;
  dbPassword: string;
  dbUser: string;
};
/**
 * Commands Object
 */
const Commands = {
  Common: {
    getPublicIp: () => `curl checkip.amazonaws.com`,
  },
  Docker: {
    createNetwork: (name: string) => `docker network create ${name}`,
    checkName: (name: string) =>
      `docker ps -a --filter "name=${name}" --format "{{.ID}}"`,
    checkNetwork: (name: string) =>
      `docker network ls --filter name=${name} --format "{{.Name}}"`,
    checkPort: (port: number | string) =>
      `docker ps --filter "publish=${port}" --format "{{.Names}}"`,
    checkStatus: (name: string) =>
      `docker ps -a --filter "name=${name}" --format "{{.Status}}"`,
    updateContainer: (name: string, action: ContainerActions) =>
      `docker ${action} ${name}`,
    getLogs: (name: string) => `docker logs ${name}`,
    restart: (name: string) => `docker restart ${name}`,
  },
  MySQL: {
    create: ({
      mysqlName,
      mysqlPassword,
      mysqlPort,
      networkName,
    }: CreateMysqlCMD) => `sudo docker run -d --name ${mysqlName} \
      --network ${networkName} \
      -e MYSQL_ROOT_PASSWORD=${mysqlPassword} \
      -p ${mysqlPort}:3306 \
      mysql:latest`,
    check: (name: string) => `docker ps -q -f name=${name}`,
    checkDb: ({
      dbName,
      mysqlName,
      mysqlPassword,
    }: CheckDbCMD) => `sudo docker exec -t ${mysqlName} mysql -u root -p${mysqlPassword} -h 127.0.0.1 \
      -e "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}';"`,
    createDbAndUser: ({
      dbName,
      dbPassword,
      dbUser,
      mysqlName,
      mysqlPassword,
    }: CreateDbAndUserCMD) => `sudo docker exec -t ${mysqlName} mysql -u root -p${mysqlPassword} -h 127.0.0.1 \
      -e "CREATE DATABASE ${dbName};
      CREATE USER '${dbUser}'@'%' IDENTIFIED BY '${dbPassword}';
      GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbUser}'@'%';
      FLUSH PRIVILEGES;"`,
  },
  Nginx: {
    create: (
      containerName: string,
      networkName: string,
    ) => `docker run -d --name ${containerName} \
          --network ${networkName} \
          -p 80:80 \
          -p 443:443 \
          -v $(pwd)/applications/confs/nginx/conf.d:/etc/nginx/conf.d:ro \
          nginx:latest`,
    reload: (containerName: string) =>
      `docker exec ${containerName} nginx -s reload`,
  },
  PhpMyAdmin: {
    create: (name: string, mySqlName: string, networkName: string) =>
      `docker run --name ${name} -d --network ${networkName}  --link ${mySqlName}:db   -e PMA_HOST=${mySqlName}   -p 8079:80   phpmyadmin`,
  },
  Redis: {
    create: (name: string, networkName: string) =>
      `docker run -d   --name ${name}   --network ${networkName}   redis:latest`,
  },
  SFTP: {
    addUser: (user: string, password: string, containerName: string) =>
      `echo "${user}:${password}" >> $(pwd)/applications/confs/sftp/users.conf && docker exec ${containerName} create-sftp-user "${user}:${password}"`,
    create: (
      containerName: string,
      networkName: string,
    ) => `cp $(pwd)/defaults/sftp/users.conf $(pwd)/applications/confs/sftp/users.conf &&
      docker run --name ${containerName} --network ${networkName} \
        -v $(pwd)/applications/confs/sftp/users.conf:/etc/sftp/users.conf:ro \
        -v $(pwd)/applications/data:/home \
        -p 2222:22 -d jmcombs/sftp
    `,
  },
  WordPress: {
    create: ({
      uniqueName,
      networkName,
      port,
      mysqlContainer,
      mysqlPort,
      dbUser,
      dbPassword,
      dbName,
    }: CreateWordPressCMD) => `sudo docker run -d --name ${uniqueName} \
            --network ${networkName} \
            -p ${port}:80 \
            -v $(pwd)/applications/data/${uniqueName}/wp:/var/www/html \
            -e WORDPRESS_DB_HOST=${mysqlContainer}:${mysqlPort} \
            -e WORDPRESS_DB_USER=${dbUser} \
            -e WORDPRESS_DB_PASSWORD=${dbPassword} \
            -e WORDPRESS_DB_NAME=${dbName} \
            wordpress:latest`,
    installWpCli: ({ uniqueName }: InstallWpCliCMD) =>
      `docker exec -t ${uniqueName} bash -c "curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x wp-cli.phar && mv wp-cli.phar /usr/local/bin/wp"`,
    setupWpCli: ({
      uniqueName,
      domain,
      siteName,
      siteDescription,
      adminName,
      adminEmail,
      adminPassword,
      redisContainer,
    }: SetupWpCliCMD) => `docker exec ${uniqueName} /bin/bash -c "
            su -s /bin/bash www-data -c 'wp core install --url=\\"${domain}\\" --title=\\"${siteName}\\" --admin_user=\\"${adminName}\\" --admin_password=\\"${adminPassword}\\" --admin_email=\\"${adminEmail}\\" --skip-email';
            su -s /bin/bash www-data -c 'wp option update siteurl \\"${domain}\\"';
            su -s /bin/bash www-data -c 'wp option update home \\"${domain}\\"';
            su -s /bin/bash www-data -c 'wp option update blogname \\"${siteName}\\"';
            su -s /bin/bash www-data -c 'wp option update blogdescription \\"${siteDescription}\\"';
            su -s /bin/bash www-data -c 'wp config set WP_REDIS_HOST  \\"${redisContainer}\\"';
            "`,
    execWpCliCommand: (
      name: string,
      command: string,
    ) => `docker exec ${name} /bin/bash -c "
            su -s /bin/bash www-data -c '${command}';
    "`,
    copySafepressPlugin: (uniqueName: string) =>
      `docker cp ./defaults/wordpress/selfpress-utils.php ${uniqueName}:/var/www/html/wp-content/plugins/selfpress-utils.php`,
    installRedisPlugin: (
      containerName: string,
    ) => `docker exec ${containerName} /bin/bash -c "
            su -s /bin/bash www-data -c 'wp plugin install redis-cache';
            su -s /bin/bash www-data -c 'wp plugin activate redis-cache';
          "`,
    activateSafepressPlugin: (uniqueName: string) =>
      `docker exec -t ${uniqueName} /bin/bash -c "su -s /bin/bash www-data -c 'wp plugin activate selfpress-utils'"`,
    replaceUrls: (containerName: string, oldUrl: string, newUrl: string) =>
      `docker exec ${containerName} /bin/bash -c "su -s /bin/bash www-data -c 'wp search-replace ${oldUrl} ${newUrl} --all-tables'"`,
  },
};

export default Commands;
