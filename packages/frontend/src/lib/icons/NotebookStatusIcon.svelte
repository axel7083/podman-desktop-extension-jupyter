<script lang="ts">
import type { Notebook } from '/@shared/src/models/Notebook';
import { StatusIcon, Spinner } from '@podman-desktop/ui-svelte';
import JupyterIcon from '/@/lib/icons/JupyterIcon.svelte';
import { jupyterClient } from '/@/api/client';

export let object: Notebook;

let status: string;
let loading: boolean;
$: {
  status = getStatus();
  loading = ['deleting', 'stopping', 'starting'].includes(object.status);
}

function getStatus(): 'RUNNING' | 'STARTING' | 'DEGRADED' | '' {
  switch (object.status) {
    case 'running':
      return 'RUNNING';
    case 'deleting':
      return 'RUNNING';
    case 'stopping':
      return 'RUNNING';
    case 'stopped':
      return '';
    case 'error':
      return 'DEGRADED';
    case 'starting':
      return 'STARTING';
    default:
      return '';
  }
}

async function navigateToContainer(): Promise<void> {
  return jupyterClient.openContainer(object.container.id);
}
</script>

{#if loading}
  <Spinner class="text-[var(--pd-table-body-text-highlight)]" />
{:else}
  <button on:click={navigateToContainer}>
    <StatusIcon size={22} status={status} icon={JupyterIcon} />
  </button>
{/if}
