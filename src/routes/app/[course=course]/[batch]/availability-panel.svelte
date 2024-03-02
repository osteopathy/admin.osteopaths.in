<script lang="ts">
	import { page } from '$app/stores';
	import { availabilityAPI } from '$lib/db/timetables';
	import AvailabilitySlot from './availability-slot.svelte';
	import { config } from './utils';
	// import type { LayoutServerData } from '../$types';
	const days = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday'
	] as const;

	export let availabilities: any = [];
	let saving = false;
	
</script>

<ul class="flex w-0 min-w-full grow flex-col gap-y-4">
	{#each days as day}
		<li class="">
			<h3 class="mb-2">Availability {day}</h3>
			<AvailabilitySlot
				{day}
				markedPointers={availabilities && availabilities[day]
					/*@ts-ignore*/
					? availabilities[day].map((e) => ({ ...e, element: null }))
					: []}
				onClick={(markedPointers, day, e) => {
					availabilities[day] = markedPointers;
					console.log(availabilities);
				}}
				startTime={config.startTime}
				endTime={config.endTime}
				minGap={config.minGap}
			/>
		</li>
	{/each}
</ul>

