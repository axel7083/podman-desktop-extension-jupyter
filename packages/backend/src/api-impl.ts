import { type OpenDialogOptions, Uri, window, env, ProgressLocation } from '@podman-desktop/api';
import { JupyterApi } from '/@shared/src/JupyterApi';
import type { NewNotebookOptions, Notebook } from '/@shared/src/models/Notebook';
import type { Notebooks } from './managers/Notebooks';

export class JupyterApiImpl extends JupyterApi {
  constructor(private notebooks: Notebooks) {
    super();
  }

  override async getNotebooks(): Promise<Notebook[]> {
    return this.notebooks.getAll();
  }

  override newNotebook(options: NewNotebookOptions): Promise<Notebook> {
    return window.withProgress(
      {
        location: ProgressLocation.TASK_WIDGET,
        title: 'Creating Jupyter Notebook',
      },
      () => this.notebooks.newSCIPYNotebook(options),
    );
  }

  override openNotebook(notebook: Notebook): Promise<boolean> {
    return env.openExternal(Uri.parse(`http://localhost:${notebook.hostPort}/lab?token=${notebook.token}`));
  }

  async openDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined> {
    return await window.showOpenDialog(options);
  }
}
