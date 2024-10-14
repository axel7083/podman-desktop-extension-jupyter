<script lang="ts">
import { router } from 'tinro';
import { Button, FormPage, Input } from '@podman-desktop/ui-svelte';
import { faRocket } from '@fortawesome/free-solid-svg-icons/faRocket';
import { faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons/faSquareArrowUpRight';
import Fa from 'svelte-fa';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { jupyterClient } from '/@/api/client';
import { Uri } from '/@shared/src/uri/Uri';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons/faMinusCircle';
import type { HostMountOptions, Notebook } from '/@shared/src/models/Notebook.ts';

let loading: boolean = $state(false);
let name: string | undefined = $state(undefined);
let image: string | undefined = $state(undefined);
let hostMountOptions: HostMountOptions[] = $state([]);

// once created the notebook will be hold in this state
let notebook: Notebook | undefined = $state(undefined);

function navigateToHome(): void {
  router.goto('/');
}

function onNameInput(event: Event): void {
  name = (event.target as HTMLInputElement).value || '';
}

function onImageInput(event: Event): void {
  image = (event.target as HTMLInputElement).value || '';
}

function onUpdateMountPath(options: HostMountOptions, event: Event): void {
  const index = hostMountOptions.indexOf(options);
  if (index === -1) return;

  hostMountOptions[index] = {
    ...hostMountOptions[index],
    destination: (event.target as HTMLInputElement).value || '',
  };
}

async function requestSelectHostPath(): Promise<void> {
  console.log('requestSelectHostPath');
  const result = await jupyterClient.openDialog({
    title: 'Select Host path',
    selectors: ['openDirectory'],
  });
  if (result === undefined || result.length !== 1) return;

  const hostPathUri = Uri.revive(result[0]);
  hostMountOptions.push({
    hostPath: hostPathUri.path,
    destination: '/mnt/',
    readOnly: false,
  });
}

function removeHostMountOptions(options: HostMountOptions): void {
  const index = hostMountOptions.indexOf(options);
  if (index === -1) return;

  hostMountOptions = hostMountOptions.toSpliced(index, 1);
}

async function openNotebook(): Promise<void> {
  if(!notebook) throw new Error('cannot open undefined notebook');
  await jupyterClient.openNotebook(notebook.container.id);
  router.goto('/');
}

async function submit(): Promise<void> {
  loading = true;
  try {
    notebook = await jupyterClient.newNotebook({
      name: $state.snapshot(name) || undefined,
      image: $state.snapshot(image) || undefined,
      hostMountOptions: $state.snapshot(hostMountOptions),
    });
  } finally {
    loading = false;
  }
}
</script>

<FormPage
  breadcrumbLeftPart="Notebooks"
  breadcrumbRightPart="New Notebooks"
  breadcrumbTitle="Go to notebooks page"
  title="New notebook"
  onclose={navigateToHome}
  onbreadcrumbClick={navigateToHome}>
  <svelte:fragment slot="icon">
    <div class="rounded-full w-8 h-8 flex items-center justify-center">
      <Fa size="1.125x" class="text-[var(--pd-content-header-icon)]" icon={faRocket} />
    </div>
  </svelte:fragment>
  <svelte:fragment slot="content">
    <div class="flex flex-col w-full">
      <!-- form -->
      <div class="space-y-6 bg-[var(--pd-content-card-bg)] m-5 px-8 sm:py-6 xl:py-8 rounded-lg h-fit">
        <div>
          <label for="notebook-name" class="block mb-2 font-bold text-[var(--pd-content-card-header-text)]"
            >Notebook name</label>
          <Input
            disabled={loading || !!notebook}
            class="w-full"
            type="text"
            name="notebook-name"
            value={name}
            on:input={onNameInput}
            placeholder="Leave blank to generate a name"
            aria-label="playgroundName" />
        </div>

        <div>
          <label for="notebook-image" class="block mb-2 font-bold text-[var(--pd-content-card-header-text)]"
            >Image</label>
          <Input
            disabled={loading || !!notebook}
            class="w-full"
            type="text"
            name="notebook-image"
            value={image}
            on:input={onImageInput}
            placeholder="Leave blank to use quay.io/jupyter/scipy-notebook:2024-10-07"
            aria-label="playgroundName" />
        </div>

        <div>
          <label for="notebook-mounts" class="block mb-2 font-bold text-[var(--pd-content-card-header-text)]"
            >Mounts</label>

          {#each hostMountOptions as options (options.hostPath)}
            <div
              class="w-full bg-[var(--pd-label-bg)] text-[var(--pd-label-text)] max-w-full rounded-md px-2 py-1 mb-2 flex flex-row w-min h-min text-sm text-nowrap items-center">
              <span class="overflow-x-hidden text-ellipsis grow">{options.hostPath}</span>
              <Input
                disabled={loading || !!notebook}
                type="text"
                name="notebook-destination-path"
                value={options.destination}
                on:input={onUpdateMountPath.bind(undefined, options)}
                placeholder="Cannot be empty"
                aria-label="mount path destination" />
              <Button
                disabled={loading || !!notebook}
                on:click={removeHostMountOptions.bind(undefined, options)}
                icon={faMinusCircle}
                type="link" />
            </div>
          {/each}

          <!-- path mount list -->
          <div class="flex flex-col">
            <Button
              title="Select path to mount"
              type="link"
              disabled={loading || !!notebook}
              on:click={requestSelectHostPath}
              icon={faPlusCircle}>Add path to mount</Button>
          </div>
        </div>

        <!-- submit section -->
        <footer>
          <div class="w-full flex flex-col">
            {#if notebook}
              <Button
                title="Open Notebook in the browser"
                inProgress={loading}
                on:click={openNotebook}
                icon={faSquareArrowUpRight}>
                Open Notebook in the browser
              </Button>
            {:else}
              <Button
                title="New Notebook"
                inProgress={loading}
                on:click={submit}
                disabled={loading || !!notebook}
                icon={faRocket}>
                New Notebook
              </Button>
            {/if}
          </div>
        </footer>
      </div>
    </div>
  </svelte:fragment>
</FormPage>
