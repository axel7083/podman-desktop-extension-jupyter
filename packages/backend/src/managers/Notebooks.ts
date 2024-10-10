import type {
  ContainerCreateResult,
  ContainerInfo,
  ContainerJSONEvent,
  Disposable,
  ProviderContainerConnection,
  Webview,
} from '@podman-desktop/api';
import { containerEngine, provider } from '@podman-desktop/api';
import type { NewNotebookOptions, Notebook } from '/@shared/src/models/Notebook';
import { getImageInfo } from '../utils/images';
import { getFreeRandomPort } from '../utils/ports';
import { generateToken } from '../utils/token';
import { Publisher } from '../utils/publisher';
import { Messages } from '/@shared/src/Messages';

export const NOTEBOOK_TOKEN_LABEL = 'notebook-token';

type NotebookContainerInfo = ContainerInfo & {
  Labels: {
    NOTEBOOK_TOKEN_LABEL: string;
  }
}

export class Notebooks extends Publisher<Notebook[]> implements Disposable {
  #disposables: Disposable[];
  #notebooks: Map<string, Notebook>;

  constructor(webview: Webview) {
    super(webview, Messages.MSG_UPDATE_NOTEBOOKS, () => this.getAll());
    this.#notebooks = new Map<string, Notebook>();
    this.#disposables = [];
  }

  getAll(): Notebook[] {
    return [];
  }

  init(): void {
    this.#disposables.push(
      containerEngine.onEvent((event: ContainerJSONEvent) => {
        console.log('Notebooks event', event);
        if (event.status === 'start') {
          return this.onContainerStart(event.id);
        }

        if(this.#notebooks.has(event.id)) {
          switch (event.status) {
            case 'remove':
              this.#notebooks.delete(event.id);
              this.notify();
              break;
            case 'die':
              this.#notebooks.set(event.id, {
                ...(this.#notebooks.get(event.id) as Notebook),
                status: 'stopped',
              });
              this.notify();
              break;
          }
        }
      }),
    );

    // refresh async
    this.refresh().catch((err: unknown) => {
      console.error(err);
    });
  }

  async refresh(): Promise<void> {
    const containers = await containerEngine.listContainers();
    for (const container of containers) {
      if(!this.isNotebook(container)) {
        console.warn(`container ${container.Id} is not a notebook`)
        continue;
      }

      console.log(`Notebook adding ${container.Id} to notebooks`);
      const notebook = this.fromNotebookContainerInfo(container);
      this.#notebooks.set(container.Id, notebook);
    }
    this.notify();
  }

  protected async onContainerStart(containerId: string): Promise<void> {
    const containerInfo = await this.getContainerInfo(containerId);
    // ignore non-notebooks
    if(!this.isNotebook(containerInfo)) return;

    // convert the containerInfo to Notebooks
    const notebook = this.fromNotebookContainerInfo(containerInfo);
    this.#notebooks.set(containerId, notebook);
    this.notify();
  }

  protected async getContainerInfo(containerId: string): Promise<ContainerInfo> {
    const containers = await containerEngine.listContainers();
    const result = containers.find(container => container.Id === containerId);
    if(!result) throw new Error('container info not found');
    return result;
  }

  protected isNotebook(containerInfo: ContainerInfo): containerInfo is NotebookContainerInfo {
    if(!containerInfo.Labels) return false;
    return NOTEBOOK_TOKEN_LABEL in containerInfo.Labels;
  }

  protected fromNotebookContainerInfo(containerInfo: NotebookContainerInfo): Notebook {
      return {
        container: {
          engineId: containerInfo.engineId,
          id: containerInfo.Id,
        },
        token: containerInfo.Labels.NOTEBOOK_TOKEN_LABEL,
        name: containerInfo.Names[0] ?? '<unknown>',
        hostPort: containerInfo.Ports[0].PublicPort ?? -1,
        status: containerInfo.State === 'running' ? 'running' : 'stopped',
      };
  }

  async newSCIPYNotebook(options?: NewNotebookOptions): Promise<Notebook> {
    const providers: ProviderContainerConnection[] = provider.getContainerConnections();
    const started = providers.find(provider => provider.connection.status() === 'started');

    if (!started) throw new Error('no provider container connection started.');

    const imageInfo = await getImageInfo(
      started.connection,
      options?.image ?? 'quay.io/jupyter/scipy-notebook:2024-10-07',
      () => {},
    );

    let hostPort: number;
    if (options?.hostPort) {
      hostPort = options.hostPort;
    } else {
      hostPort = await getFreeRandomPort();
    }

    const token = generateToken();

    const result: ContainerCreateResult = await containerEngine.createContainer(imageInfo.engineId, {
      Image: imageInfo.Id,
      name: options?.name,
      Env: [`JUPYTER_TOKEN=${token}`],
      Labels: {
        [NOTEBOOK_TOKEN_LABEL]: token,
      },
      HostConfig: {
        PortBindings: {
          '8888/tcp': [
            {
              HostPort: `${hostPort}`,
            },
          ],
        },
        Mounts: options?.hostMountOptions.map(hostMountOption => ({
          Type: 'bind',
          Target: hostMountOption.destination,
          Source: hostMountOption.hostPath,
          ReadOnly: hostMountOption.readOnly,
        })),
      },
    });

    return {
      container: result,
      name: options?.name ?? '',
      token: token,
      hostPort: hostPort,
      status: 'running',
    };
  }

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
  }
}
