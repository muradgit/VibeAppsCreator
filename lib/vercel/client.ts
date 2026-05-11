export interface VercelProject {
    id: string;
    name: string;
    status: string;
}

export class VercelClient {
    private token: string;
    private baseUrl = 'https://api.vercel.com';

    constructor(token: string) {
        this.token = token;
    }

    async getProjects() {
        const response = await fetch(`${this.baseUrl}/v9/projects`, {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch Vercel projects');
        }

        return response.json();
    }

    async createProject(name: string, framework: string = 'nextjs') {
        const response = await fetch(`${this.baseUrl}/v9/projects`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                framework,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create Vercel project');
        }

        return response.json();
    }
}

export const getVercelClient = (token?: string) => {
    const finalToken = token || process.env.VERCEL_API_TOKEN;
    if (!finalToken) {
        throw new Error('Vercel API token is missing');
    }
    return new VercelClient(finalToken);
};
