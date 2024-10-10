<script lang="ts">
import { Table, TableColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import type { Notebook } from '/@shared/src/models/Notebook';
import NotebookStatusIcon from '/@/lib/icons/NotebookStatusIcon.svelte';
import NotebookActions from '/@/lib/actions/NotebookActions.svelte';

const columns = [
  new TableColumn<Notebook>('Status', { width: '70px', align: 'center', renderer: NotebookStatusIcon }),
  new TableColumn<Notebook, string>('Name', {
    width: '1fr',
    renderer: TableSimpleColumn,
    renderMapping: object => object.name,
  }),
  new TableColumn<Notebook>('Actions', {
    align: 'right',
    width: '120px',
    renderer: NotebookActions,
    overflow: true,
  }),
];

const row = new TableRow<Notebook>({});
export let data: (Notebook & { selected?: boolean })[];
</script>

{#if data?.length > 0}
  <Table kind="Notebooks" data={data} columns={columns} row={row}></Table>
{:else}
  <slot name="empty-screen" />
{/if}
