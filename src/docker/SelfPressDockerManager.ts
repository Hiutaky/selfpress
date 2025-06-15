import Docker, { Container, Network, ContainerInfo, ContainerStats, NetworkInspectInfo } from 'dockerode';
import path from 'path';
import fs from "fs/promises";
import { ConfigureWordPressParams, ManageSiteResult, MySQLContainerParams, SiteConfig, SiteListEntry, SiteStats, WordPressContainerParams } from './types';



class SelfPressDockerManager {
    public docker: Docker;
    public sitesDir: string;

    constructor() {
        this.docker = new Docker();
        this.sitesDir = path.join(process.cwd(), 'sites');
    }

    /**
     * Create a new WordPress instance plus all the dependencies
     * @param siteConfig 
     * @returns 
     */
    async createWordPressSite(siteConfig: SiteConfig): Promise<{
        success: boolean;
        siteName: string;
        containers: { wordpress: string; mysql: string };
        network: string;
        domain: string;
    }> {
        const {
            siteName,
            domain,
            dbPassword,
            wpTitle = 'My WordPress Site',
            wpUser = 'admin',
            wpPassword,
            wpEmail
        } = siteConfig;

        try {
            // 1. Crea la directory del sito
            const siteDir = path.join(this.sitesDir, siteName);
            await fs.mkdir(siteDir, {
                recursive: true
            });
            await fs.mkdir(path.join(siteDir, 'wp-content'), {
                recursive: true
            });
            await fs.mkdir(path.join(siteDir, 'db-data'), {
                recursive: true
            });

            // 2. Crea la rete Docker per il sito
            const networkName = `${siteName}_network`;
            await this.createNetwork(networkName);

            // 3. Crea e avvia il container MySQL
            const dbContainer = await this.createMySQLContainer({
                siteName,
                networkName,
                dbPassword,
                siteDir
            });

            // 4. Attendi che MySQL sia pronto
            await this.waitForMySQL(dbContainer, dbPassword);

            // 5. Crea e avvia il container WordPress
            const wpContainer = await this.createWordPressContainer({
                siteName,
                networkName,
                domain,
                dbPassword,
                siteDir
            });

            // 6. Configura WordPress (opzionale)
            if (typeof this.configureWordPress === "function") {
                await this.configureWordPress({
                    container: wpContainer,
                    wpTitle,
                    wpUser,
                    wpPassword,
                    wpEmail,
                    domain
                });
            }

            return {
                success: true,
                siteName,
                containers: {
                    wordpress: (wpContainer as any).id,
                    mysql: (dbContainer as any).id
                },
                network: networkName,
                domain
            };

        } catch (error: any) {
            console.error(`Errore creazione sito ${siteName}:`, error);
            // Cleanup in caso di errore
            await this.cleanupSite(siteName);
            throw error;
        }
    }

    // Crea la rete Docker
    async createNetwork(networkName: string): Promise<Network> {
        try {
            const network = await this.docker.createNetwork({
                Name: networkName,
                Driver: 'bridge',
                IPAM: {
                    // @dev: to check driver 
                    Driver: "",
                    Config: [{
                        Subnet: '172.20.0.0/16'
                    }]
                }
            });
            return network;
        } catch (error: any) {
            if (error.statusCode === 409) {
                // Rete già esistente
                return this.docker.getNetwork(networkName);
            }
            throw error;
        }
    }

    // Crea container MySQL
    async createMySQLContainer({
        siteName,
        networkName,
        dbPassword,
        siteDir
    }: MySQLContainerParams): Promise<Container> {
        const containerName = `${siteName}_mysql`;
        const dbDataPath = path.join(siteDir, 'db-data');

        const container = await this.docker.createContainer({
            Image: 'mysql:8.0',
            name: containerName,
            Env: [
                'MYSQL_ROOT_PASSWORD=' + dbPassword,
                'MYSQL_DATABASE=wordpress',
                'MYSQL_USER=wordpress',
                'MYSQL_PASSWORD=' + dbPassword
            ],
            HostConfig: {
                Binds: [`${dbDataPath}:/var/lib/mysql`],
                NetworkMode: networkName,
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    [networkName]: {
                        Aliases: ['mysql']
                    }
                }
            }
        });

        await container.start();
        return container;
    }

    // Crea container WordPress
    async createWordPressContainer({
        siteName,
        networkName,
        domain,
        dbPassword,
        siteDir
    }: WordPressContainerParams): Promise<Container> {
        const containerName = `${siteName}_wordpress`;
        const wpContentPath = path.join(siteDir, 'wp-content');

        const container = await this.docker.createContainer({
            Image: 'wordpress:latest',
            name: containerName,
            Env: [
                'WORDPRESS_DB_HOST=mysql:3306',
                'WORDPRESS_DB_NAME=wordpress',
                'WORDPRESS_DB_USER=wordpress',
                'WORDPRESS_DB_PASSWORD=' + dbPassword,
                'WORDPRESS_TABLE_PREFIX=wp_'
            ],
            HostConfig: {
                Binds: [`${wpContentPath}:/var/www/html/wp-content`],
                NetworkMode: networkName,
                RestartPolicy: {
                    Name: 'unless-stopped'
                }
            },
            NetworkingConfig: {
                EndpointsConfig: {
                    [networkName]: {
                        Aliases: ['wordpress']
                    }
                }
            },
            Labels: {
                'selfpress.site': siteName,
                'selfpress.domain': domain,
                'traefik.enable': 'true',
                [`traefik.http.routers.${siteName}.rule`]: `Host(\`${domain}\`)`,
                [`traefik.http.services.${siteName}.loadbalancer.server.port`]: '80'
            }
        });

        await container.start();
        return container;
    }

    // Attende che MySQL sia pronto
    async waitForMySQL(container: Container, dbPassword: string, maxAttempts: number = 30): Promise<boolean> {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const exec = await container.exec({
                    Cmd: ['mysql', '-uroot', '-p' + dbPassword, '-e', 'SELECT 1'],
                    AttachStdout: true,
                    AttachStderr: true
                });

                await exec.start({});
                // Se il comando riesce, MySQL è pronto
                return true;
            } catch (error) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        throw new Error('MySQL non è diventato disponibile nel tempo previsto');
    }

    // Lista tutti i siti
    async listSites(): Promise<SiteListEntry[]> {
        const containers: ContainerInfo[] = await this.docker.listContainers({
            all: true,
            filters: {
                label: ['selfpress.site']
            }
        });

        const sites: Record<string, SiteListEntry> = {};

        for (const containerInfo of containers) {
            const siteName = containerInfo.Labels?.['selfpress.site'];
            if (!siteName) continue;
            if (!sites[siteName]) {
                sites[siteName] = {
                    name: siteName,
                    domain: containerInfo.Labels?.['selfpress.domain'] ?? '',
                    containers: []
                };
            }

            sites[siteName].containers.push({
                id: containerInfo.Id,
                name: containerInfo.Names[0]?.replace('/', '') ?? '',
                image: containerInfo.Image,
                state: containerInfo.State,
                status: containerInfo.Status
            });
        }

        return Object.values(sites);
    }

    // Gestisce un sito (start, stop, restart)
    async manageSite(siteName: string, action: 'start' | 'stop' | 'restart'): Promise<ManageSiteResult[]> {
        const containers: ContainerInfo[] = await this.docker.listContainers({
            all: true,
            filters: {
                label: [`selfpress.site=${siteName}`]
            }
        });

        const results: ManageSiteResult[] = [];

        for (const containerInfo of containers) {
            const container = this.docker.getContainer(containerInfo.Id);

            try {
                switch (action) {
                    case 'start':
                        await container.start();
                        break;
                    case 'stop':
                        await container.stop();
                        break;
                    case 'restart':
                        await container.restart();
                        break;
                }

                results.push({
                    container: containerInfo.Names[0],
                    action,
                    success: true
                });
            } catch (error: any) {
                results.push({
                    container: containerInfo.Names[0],
                    action,
                    success: false,
                    error: error.message
                });
            }
        }

        return results;
    }

    // Elimina completamente un sito
    async deleteSite(siteName: string): Promise<{ success: boolean; siteName: string }> {
        try {
            // 1. Ferma e rimuovi i container
            const containers: ContainerInfo[] = await this.docker.listContainers({
                all: true,
                filters: {
                    label: [`selfpress.site=${siteName}`]
                }
            });

            for (const containerInfo of containers) {
                const container = this.docker.getContainer(containerInfo.Id);
                try {
                    await container.stop();
                    await container.remove();
                } catch (error: any) {
                    console.warn(`Errore rimozione container ${containerInfo.Names[0]}:`, error.message);
                }
            }

            // 2. Rimuovi la rete
            try {
                const network = this.docker.getNetwork(`${siteName}_network`);
                await network.remove();
            } catch (error: any) {
                console.warn(`Errore rimozione rete ${siteName}_network:`, error.message);
            }

            // 3. Rimuovi i file (opzionale - potresti voler fare backup)
            const siteDir = path.join(this.sitesDir, siteName);
            // fs.rmdir is deprecated, use fs.rm
            await fs.rm(siteDir, {
                recursive: true,
                force: true
            });

            return {
                success: true,
                siteName
            };
        } catch (error: any) {
            console.error(`Errore eliminazione sito ${siteName}:`, error);
            throw error;
        }
    }

    // Cleanup in caso di errore
    async cleanupSite(siteName: string): Promise<void> {
        try {
            await this.deleteSite(siteName);
        } catch (error: any) {
            console.error(`Errore durante cleanup di ${siteName}:`, error);
        }
    }

    // Ottieni statistiche dei container
    async getSiteStats(siteName: string): Promise<SiteStats[]> {
        const containers: ContainerInfo[] = await this.docker.listContainers({
            filters: {
                label: [`selfpress.site=${siteName}`]
            }
        });

        const stats: SiteStats[] = [];

        for (const containerInfo of containers) {
            const container = this.docker.getContainer(containerInfo.Id);
            const containerStats: any = await container.stats({
                stream: false
            });

            stats.push({
                name: containerInfo.Names[0]?.replace('/', '') ?? '',
                cpu: this.calculateCPUPercent(containerStats),
                memory: this.calculateMemoryUsage(containerStats),
                network: containerStats.networks
            });
        }

        return stats;
    }

    // Calcola percentuale CPU
    calculateCPUPercent(stats: any): number {
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        if (systemDelta === 0) return 0;
        const cpuPercent = (cpuDelta / systemDelta) * (stats.cpu_stats.online_cpus || 1) * 100;
        return Math.round(cpuPercent * 100) / 100;
    }

    // Calcola uso memoria
    calculateMemoryUsage(stats: any): { used: number; available: number; percent: number } {
        const used = stats.memory_stats.usage - (stats.memory_stats.stats?.cache || 0);
        const available = stats.memory_stats.limit;
        return {
            used: Math.round(used / 1024 / 1024), // MB
            available: Math.round(available / 1024 / 1024), // MB
            percent: Math.round((used / available) * 100)
        };
    }

    // Placeholder for configureWordPress, to be implemented elsewhere
    async configureWordPress(params: ConfigureWordPressParams): Promise<void> {
        // Implementation should be provided elsewhere
        return;
    }
}

export default SelfPressDockerManager;