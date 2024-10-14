import type { NewNotebookOptions, Notebook } from './models/Notebook';
import type { OpenDialogOptions, Uri } from '@podman-desktop/api';

export abstract class JupyterApi {
  abstract getNotebooks(): Promise<Notebook[]>;

  abstract openDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined>;

  abstract newNotebook(options: NewNotebookOptions): Promise<Notebook>;

  abstract openNotebook(id: string): Promise<boolean>;

  abstract stopNotebook(id: string): Promise<void>;

  abstract startNotebook(id: string): Promise<void>;

  abstract deleteNotebook(id: string): Promise<void>;
}
