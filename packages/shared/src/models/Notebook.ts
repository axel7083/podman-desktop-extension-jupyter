export interface NewNotebookOptions {
  name?: string;
  image?: string;
  hostPort?: number;
  hostMountOptions: HostMountOptions[];
}

export type NotebookStatus = 'stopped' | 'running' | 'deleting' | 'stopping' | 'error' | 'starting';

export interface Notebook {
  status: NotebookStatus;
  container: {
    engineId: string;
    id: string;
  };
  name: string;
  token: string;
  hostPort: number;
}

export interface HostMountOptions {
  hostPath: string;
  destination: string;
  readOnly: boolean;
}
