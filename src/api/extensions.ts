import { apiClient } from "./client";

export interface Extension {
    name: string;
    isBlocked: boolean;
    type: 'FIXED' | 'CUSTOM';
}
  
export interface CreateRequest {
    name: string;
}
  
export interface UpdateBlockRequest {
    isBlocked: boolean;
}

export async function getExtensions(): Promise<Extension[]> {
    return apiClient.request<Extension[]>('/api/extensions', {
        method: 'GET',
    });
}

export async function createCustomExtension(
    name: string,
): Promise<Extension> {
    return apiClient.request<Extension>(`/api/extensions`, {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}

export async function updateExtensionBlockStatus(
    name: string,
    isBlocked: boolean,
): Promise<Extension> {
    return apiClient.request<Extension>(`/api/extensions/${name}/block`, {
        method: 'PATCH',
        body: JSON.stringify({ isBlocked }),
    });
}

export async function deleteCustomExtension(
    name: string,
): Promise<void> {
    return apiClient.request<void>(`/api/extensions/${name}`, {
        method: 'DELETE',
    });
}
