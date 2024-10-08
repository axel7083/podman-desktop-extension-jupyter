export interface NewNotebookOptions {
  name?: string;
  image?: string;
  hostPort?: number;
  hostMountOptions: HostMountOptions[];
}

export interface Notebook {
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
