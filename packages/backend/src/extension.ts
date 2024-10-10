import type { ExtensionContext } from '@podman-desktop/api';
import { RpcExtension } from '/@shared/src/messages/MessageProxy';
import { JupyterApiImpl } from './api-impl';
import { initWebview } from './utils/webview';
import { Notebooks } from './managers/Notebooks';

export async function activate(extensionContext: ExtensionContext): Promise<void> {
  const panel = await initWebview(extensionContext.extensionUri);
  extensionContext.subscriptions.push(panel);

  // We now register the 'api' for the webview to communicate to the backend
  const rpcExtension = new RpcExtension(panel.webview);
  extensionContext.subscriptions.push(rpcExtension);

  const notebooks = new Notebooks(panel.webview);
  notebooks.init();
  extensionContext.subscriptions.push(notebooks);

  rpcExtension.init();
  rpcExtension.registerInstance<JupyterApiImpl>(JupyterApiImpl, new JupyterApiImpl(notebooks));
}

export async function deactivate(): Promise<void> {
  console.log('stopping jupyter extension');
}
