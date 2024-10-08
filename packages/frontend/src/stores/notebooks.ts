import { RPCReadable } from '/@/utils/rpcReadable';
import type { Notebook } from '/@shared/src/models/Notebook';
import { Messages } from '/@shared/src/Messages';
import { jupyterClient } from '/@/api/client';

export const notebooks = RPCReadable<Notebook[]>([], [Messages.MSG_UPDATE_NOTEBOOKS], jupyterClient.getNotebooks);
