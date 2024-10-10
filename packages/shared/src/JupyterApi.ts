import type { NewNotebookOptions, Notebook } from './models/Notebook';
import type { OpenDialogOptions, Uri } from '@podman-desktop/api';

export abstract class JupyterApi {
  abstract getNotebooks(): Promise<Notebook[]>;

  abstract openDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined>;

  abstract newNotebook(options: NewNotebookOptions): Promise<Notebook>;

  abstract openNotebook(notebook: Notebook): Promise<boolean>;

  abstract stopNotebook(notebook: Notebook): Promise<void>;

  abstract startNotebook(notebook: Notebook): Promise<void>;

  abstract deleteNotebook(notebook: Notebook): Promise<void>;
}
