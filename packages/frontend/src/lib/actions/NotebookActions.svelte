<script lang="ts">
import type { Notebook } from '/@shared/src/models/Notebook';
import ListItemButtonIcon from '/@/lib/buttons/ListItemButtonIcon.svelte';
import { faArrowUpRightFromSquare, faPlay, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { jupyterClient } from '/@/api/client';

export let object: Notebook;

function openNotebook(): void {
  jupyterClient.openNotebook(object).catch((err: unknown) => {
    console.error(err);
  });
}

function stopNotebook(): void {
  jupyterClient.stopNotebook(object).catch((err: unknown) => {
    console.error(err);
  });
}

function startNotebook(): void {
  jupyterClient.startNotebook(object).catch((err: unknown) => {
    console.error(err);
  });
}

function deleteNotebook(): void {
  jupyterClient.deleteNotebook(object).catch((err: unknown) => {
    console.error(err);
  });
}
</script>

{#if object.status === 'running'}
  <ListItemButtonIcon icon={faStop} onClick={stopNotebook} title="Stop AI App" />
  <ListItemButtonIcon icon={faArrowUpRightFromSquare} onClick={openNotebook} title="Open Notebook" />
{:else}
  <ListItemButtonIcon icon={faPlay} onClick={startNotebook} title="Start Notebook" />
  <ListItemButtonIcon icon={faTrash} onClick={deleteNotebook} title="Delete Notebook" />
{/if}
