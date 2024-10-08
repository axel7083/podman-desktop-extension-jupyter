<script lang="ts">
import './app.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { router } from 'tinro';
import Route from './lib/Route.svelte';
import { onMount } from 'svelte';
import { getRouterState } from './api/client';
import Home from './pages/Home.svelte';
import NewNotebook from '/@/pages/NewNotebook.svelte';

router.mode.hash();
let isMounted = false;

onMount(() => {
  // Load router state on application startup
  const state = getRouterState();
  router.goto(state.url);
  isMounted = true;
});
</script>

<Route path="/*" breadcrumb="Hello World" isAppMounted={isMounted}>
  <main class="flex flex-col w-screen h-screen overflow-hidden bg-[var(--pd-content-bg)]">
    <div class="flex flex-row w-full h-full overflow-hidden">
      <Route path="/" breadcrumb="home">
        <NewNotebook />
      </Route>
      <Route path="/notebook/new" breadcrumb="New Notebook">
        <NewNotebook />
      </Route>
    </div>
  </main>
</Route>
