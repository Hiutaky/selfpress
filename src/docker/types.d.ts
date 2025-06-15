export type SiteConfig = {
    siteName: string,
    domain: string,
    dbPassword: string,
    wpTitle: string,
    wpUser: string,
    wpPassword: string,
    wpEmail: string
}

export type MySQLContainerParams = {
    siteName: string;
    networkName: string;
    dbPassword: string;
    siteDir: string;
};

export type WordPressContainerParams = {
    siteName: string;
    networkName: string;
    domain: string;
    dbPassword: string;
    siteDir: string;
};

export type ConfigureWordPressParams = {
    container: Container;
    wpTitle: string;
    wpUser: string;
    wpPassword: string;
    wpEmail: string;
    domain: string;
};

export type SiteListContainer = {
    id: string;
    name: string;
    image: string;
    state: string;
    status: string;
};

export type SiteListEntry = {
    name: string;
    domain: string;
    containers: SiteListContainer[];
};

export type ManageSiteResult = {
    container: string;
    action: string;
    success: boolean;
    error?: string;
};

export type SiteStats = {
    name: string;
    cpu: number;
    memory: {
        used: number;
        available: number;
        percent: number;
    };
    network: any;
};