interface Platform {
    enabled: boolean;

    baseURL: string;

    personalAccessToken: string;
}

export interface Config {
    startDate: Date;

    endDate: Date;

    azure: Platform;

    gitlab: Platform;

    httpTimeoutInMS: number;
}
