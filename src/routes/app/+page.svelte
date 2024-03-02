<script lang="ts">
    import { Temporal } from "temporal-polyfill"
    import ordinal from "ordinal"

    let now = Temporal.Now.plainDateISO();
    if (now.month < 7) {
        now = now.subtract({years: 1});
    }
    const courses: {
        id: string;
        label: string;
        duration: number;
        batches: {
            label: string;
            year: number;
        }[]
    }[] = [
        {
            id: "bos",
            label: "B.Sc Osteopathy",
            duration: 4,
            batches: [],
        },
        {   id: "mos",
            label: "M.Sc Osteopathy",
            duration: 2,
            batches: []
        },
        {   id: "ios",
            label: "Integrated Osteopathy",
            duration: 1,
            batches: []
        }
    ]  
    for (let index = 0; index < courses.length; index++) {
        const course = courses[index];
        let temp = Temporal.PlainYearMonth.from({year: now.year, month: now.month});
        for (let year = 1; year <= course.duration; year++) {
            course.batches.push({
                label: `${ordinal(year)} year`,
                year: temp.year,
            })
            temp = temp.subtract({years: 1});
        }
    }
</script>
<h1 class="text-4xl mb-8 font-black">
    Osteopathy Batch
</h1>

<ul class="flex flex-col gap-y-12 pl-6">
    {#each courses as course}
        <li>
            <h3 class="text-3xl font-semibold mb-4">
                {course.label}
            </h3>
            <ul class="flex pl-6 flex-col gap-y-2 text-gray-600 font-medium text-xl">
                {#each [...course.batches.reverse()] as batch}
                    <li class="">
                        <a class="text-blue-500 underline underline-offset-2" href="/app/{course.id}/{batch.year}">{batch.year}-{batch.label}</a>
                    </li>
                {/each}
            </ul>
        </li>
    {/each}
    
</ul>