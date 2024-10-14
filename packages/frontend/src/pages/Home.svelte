<script lang="ts">
import { NavPage, EmptyScreen, Button } from '@podman-desktop/ui-svelte';
import { faPlusCircle, faServer } from '@fortawesome/free-solid-svg-icons';
import { router } from 'tinro';
import Notebooks from '/@/lib/table/Notebooks.svelte';
import { notebooks } from '/@/stores/notebooks';

function navigateToNewNotebook(): void {
  router.goto('/notebook/new');
}
</script>

<NavPage title="Notebooks" searchEnabled={false}>
  <div slot="additional-actions">
    <Button icon={faPlusCircle} on:click={navigateToNewNotebook}>New Notebook</Button>
  </div>
  <div slot="content" class="flex flex-col min-w-full min-h-full space-y-5">
    <div class="flex w-full h-full">
      <Notebooks data={$notebooks}>
        <svelte:fragment slot="empty-screen">
          <EmptyScreen icon={faServer} title="No Notebooks" message="You have no running notebooks">
            <div class="flex gap-2 justify-center">
              <Button type="link" on:click={navigateToNewNotebook}>New Notebooks</Button>
            </div>
          </EmptyScreen>
        </svelte:fragment>
      </Notebooks>
    </div>
  </div>
</NavPage>
