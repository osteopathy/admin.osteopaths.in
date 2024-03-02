<script lang="ts">
	import { page } from "$app/stores";
	import type { PageServerData } from "./$types";
	import AvailabilityPanel from "./availability-panel.svelte";

    export let data:PageServerData;
</script>

<h1 class="text-4xl mb-4 font-black">
    {data.course?.label} ({$page.params.batch}-batch)
</h1>
<p>
    {data.course?.description}
</p>

<AvailabilityPanel availabilities={data.availability} />