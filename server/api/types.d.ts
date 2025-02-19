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