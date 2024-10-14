import { type OpenDialogOptions, Uri, window, env, ProgressLocation, navigation } from '@podman-desktop/api';
import { JupyterApi } from '/@shared/src/JupyterApi';
import type { NewNotebookOptions, Notebook } from '/@shared/src/models/Notebook';
import type { Notebooks } from './managers/notebooks';

export class JupyterApiImpl extends JupyterApi {
  constructor(private notebooks: Notebooks) {
    super();
  }

  override async getNotebooks(): Promise<Notebook[]> {
    return this.notebooks.getAll();
  }

  override async startNotebook(id: string): Promise<void> {
    return this.notebooks.startNotebook(id);
  }

  override async stopNotebook(id: string): Promise<void> {
    return this.notebooks.stopNotebook(id);
  }

  override async deleteNotebook(id: string): Promise<void> {
    return this.notebooks.deleteNotebook(id);
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

  override openNotebook(id: string): Promise<boolean> {
    const notebook = this.notebooks.get(id);
    return env.openExternal(Uri.parse(`http://localhost:${notebook.hostPort}/lab?token=${notebook.token}`));
  }

  override async openDialog(options?: OpenDialogOptions): Promise<Uri[] | undefined> {
    return await window.showOpenDialog(options);
  }

  override async openContainer(id: string): Promise<void> {
    return navigation.navigateToContainer(id);
  }
}
