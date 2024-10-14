<script lang="ts">
import type { Notebook } from '/@shared/src/models/Notebook';
import ListItemButtonIcon from '/@/lib/buttons/ListItemButtonIcon.svelte';
import { faArrowUpRightFromSquare, faPlay, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { jupyterClient } from '/@/api/client';

export let object: Notebook;

let loading: boolean = false;
$: {
  loading = ['deleting', 'stopping', 'starting'].includes(object.status);
}
function openNotebook(): void {
  jupyterClient.openNotebook(object.container.id).catch((err: unknown) => {
    console.error(err);
  });
}

function stopNotebook(): void {
  jupyterClient.stopNotebook(object.container.id).catch((err: unknown) => {
    console.error(err);
  });
}

function startNotebook(): void {
  jupyterClient.startNotebook(object.container.id).catch((err: unknown) => {
    console.error(err);
  });
}

function deleteNotebook(): void {
  jupyterClient.deleteNotebook(object.container.id).catch((err: unknown) => {
    console.error(err);
  });
}
</script>

{#if object.status === 'running'}
  <ListItemButtonIcon enabled={!loading} icon={faStop} onClick={stopNotebook} title="Stop AI App" />
  <ListItemButtonIcon enabled={!loading} icon={faArrowUpRightFromSquare} onClick={openNotebook} title="Open Notebook" />
{:else}
  <ListItemButtonIcon enabled={!loading} icon={faPlay} onClick={startNotebook} title="Start Notebook" />
  <ListItemButtonIcon enabled={!loading} icon={faTrash} onClick={deleteNotebook} title="Delete Notebook" />
{/if}
