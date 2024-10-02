export type CreateWordPressCMD = {
  uniqueName: string;
  networkName: string;
  port: string | number;
  dockerPath: string;
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
  port: number | string;
  siteName: string;
  siteDescription: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
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
  Docker: {
    createNetwork: (name: string) => `docker network create ${name}`,
    checkName: (name: string) =>
      `docker network ls --filter name=${name} --format "{{.Name}}"`,
    checkPort: (port: number | string) =>
      `docker ps --filter "publish=${port}" --format "{{.Names}}"`,
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
  WordPress: {
    create: ({
      uniqueName,
      networkName,
      port,
      dockerPath,
      mysqlContainer,
      mysqlPort,
      dbUser,
      dbPassword,
      dbName,
    }: CreateWordPressCMD) => `sudo docker run -d --name ${uniqueName} \
            --network ${networkName} \
            -p ${port}:80 \
            -v ${dockerPath}/${uniqueName}:/var/www/html \
            -e WORDPRESS_DB_HOST=${mysqlContainer}:${mysqlPort} \
            -e WORDPRESS_DB_USER=${dbUser} \
            -e WORDPRESS_DB_PASSWORD=${dbPassword} \
            -e WORDPRESS_DB_NAME=${dbName} \
            wordpress:latest`,
    installWpCli: ({ uniqueName }: InstallWpCliCMD) =>
      `docker exec -t ${uniqueName} bash -c "curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x wp-cli.phar && mv wp-cli.phar /usr/local/bin/wp"`,
    setupWpCli: ({
      uniqueName,
      port,
      siteName,
      siteDescription,
      adminName,
      adminEmail,
      adminPassword,
    }: SetupWpCliCMD) => `docker exec ${uniqueName} /bin/bash -c "
            su -s /bin/bash www-data -c 'wp core install --url=\\"http://localhost:${port}\\" --title=\\"${siteName}\\" --admin_user=\\"${adminName}\\" --admin_password=\\"${adminPassword}\\" --admin_email=\\"${adminEmail}\\" --skip-email';
            su -s /bin/bash www-data -c 'wp option update siteurl \\"http://localhost:${port}\\"';
            su -s /bin/bash www-data -c 'wp option update home \\"http://localhost:${port}\\"';
            su -s /bin/bash www-data -c 'wp option update blogname \\"${siteName}\\"';
            su -s /bin/bash www-data -c 'wp option update blogdescription \\"${siteDescription}\\"';
            "`,
    copySafepressPlugin: (uniqueName: string) =>
      `docker cp ./wordpress/selfpress-utils.php ${uniqueName}:/var/www/html/wp-content/plugins/selfpress-utils.php`,
    activateSafepressPlugin: (uniqueName: string) =>
      `docker exec -t ${uniqueName} /bin/bash -c "su -s /bin/bash www-data -c 'wp plugin activate selfpress-utils'"`,
  },
};

export default Commands;
