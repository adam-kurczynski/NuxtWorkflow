export type TimelogResponse = { 
  user_timelog: {
    id: number;
    userId: number;
    projectId: number;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
};
projects: {
    id: number;
    name: string;
    description: string | null;
    clientId: number;
    createdAt: Date;
    status: string;
} | null;
users: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    name: string;
} | null;
};

export type User = {
    id: number;
    email: string;
    avatar: string;
    username: string;
    name: string;
    role: string;
}

export type Asset = {
    id: number;
    name: string;
    description: string;
    unit: string;
    createdAt: Date;
}

export type AssetUsageResponse = {
    asset_usage: {
        id: number;
        assetId: number;
        projectId: number;
        quantity: number;
        createdAt: Date;
        addedBy: number;
    };
    assets: {
        id: number;
        name: string;
        description: string;
        unit: string;
        createdAt: Date;
    } | null;
    projects: {
        id: number;
        name: string;
        description: string;
        clientId: number;
        createdAt: Date;
        status: string;
    } | null;
    users: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        name: string;
    } | null;

}

export type TimeOffResponse = {
    time_off: {
        id: number;
        userId: number;
        startTime: Date;
        endTime: Date;
        createdTime: Date;
    };
    users: {
        id: number;
        email: string;
        lastName: string;
        createdAt: Date;
        name: string;
        username: string;
    } | null;
}

export type ProjectResponse = {
    projects: {
        id: number;
        name: string;
        description: string | null;
        clientId: number;
        createdAt: Date;
        status: string;
    };
    clients: {
        id: number;
        name: string;
        address: Date;
        phone: string | null;
    } | null;
}

export type AggregatedUsageResponse = {
    assetId: number;
    quantity: number;
    assetName: string;
    unit: string;
}