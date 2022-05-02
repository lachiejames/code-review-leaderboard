interface Platform {
    enabled: boolean;

    baseUrl: string;

    personalAccessToken: string;
}

export interface Config {
    startDate: Date;

    endDate: Date;

    azure: Platform;

    github: Platform;

    gitlab: Platform;

    httpTimeoutInMS: number;
}
