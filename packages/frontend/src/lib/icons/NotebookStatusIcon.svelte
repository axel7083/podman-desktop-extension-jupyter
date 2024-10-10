<script lang="ts">
import type { Notebook } from '/@shared/src/models/Notebook';
import { StatusIcon } from '@podman-desktop/ui-svelte';
import JupyterIcon from '/@/lib/icons/JupyterIcon.svelte';

export let object: Notebook;
let status: string;
$: status = object.status === 'running' ? 'RUNNING' : 'USED';
</script>

<StatusIcon size={22} status={status} icon={JupyterIcon} />
