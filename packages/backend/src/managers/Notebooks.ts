import type { ContainerCreateResult, Disposable, ProviderContainerConnection } from '@podman-desktop/api';
import { provider, containerEngine } from '@podman-desktop/api';
import type { NewNotebookOptions, Notebook } from '/@shared/src/models/Notebook';
import { getImageInfo } from '../utils/images';
import { getFreeRandomPort } from '../utils/ports';
import { generateToken } from '../utils/token';

export class Notebooks implements Disposable {
  constructor() {}

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
      Env: [`JUPYTER_TOKEN=${token}`],
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
    };
  }

  dispose(): void {}
}
