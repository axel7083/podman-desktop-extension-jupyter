<script lang="ts">
import { Table, TableColumn, TableRow } from '@podman-desktop/ui-svelte';
import type { Notebook } from '/@shared/src/models/Notebook';

const columns: TableColumn<Notebook>[] = [];

const row = new TableRow<Notebook>({});
export let data: (Notebook & { selected?: boolean })[];
</script>

{#if data?.length > 0}
  <Table kind="Notebooks" data={data} columns={columns} row={row}></Table>
{:else}
  <slot name="empty-screen" />
{/if}
