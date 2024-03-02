import { db } from "$lib/db";
import { and, eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { availabilityTable, courseTable, osteopathTable } from "$lib/db/schema";
import { config, fromTimeStr } from "./utils";
import { Temporal } from "temporal-polyfill";
import { availabilityAPI, type Availability } from "$lib/db/timetables";
import groupBy from "just-group-by"

function flatToWeeks(grouped: Availability) {
    const startTime = new Temporal.PlainTime(config.startTime);
    const endTime = new Temporal.PlainTime(config.endTime);
    const gap = config.minGap;

    // sunday, monday, tuesday
    const keys = Object.keys(grouped) as unknown as [keyof typeof grouped];

    const res: Record<
        (typeof keys)[number],
        {
            start: {
                x: number;
                time: string;
            };
            end: {
                x: number;
                time: string;
            };
        }[]
    > = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        friday: [],
        thursday: [],
        saturday: []
    } as const;

    for (let index = 0; index < keys.length; index++) {
        const key = keys[index];

        grouped[key].sort((a, b) => {
            const startA = fromTimeStr(a.startTime);
            const startB = fromTimeStr(b.startTime);
            return startA.since(startB).sign;
        });

        const number_of_elements =
            (startTime.until(endTime).hours * 60 + startTime.until(endTime).minutes) / gap;
        const unit = 100 / number_of_elements;

        res[key] = grouped[key].map((slot) => {
            const slotStartAt = fromTimeStr(slot.startTime);
            const slotEndAt = fromTimeStr(slot.endTime);

            const startAt =
                (startTime.until(slotStartAt).hours * 60 + startTime.until(slotStartAt).minutes) / gap;
            const endAt =
                (startTime.until(slotEndAt).hours * 60 + startTime.until(slotEndAt).minutes) / gap;

            const start = {
                x: startAt * unit,
                time: slotStartAt.toLocaleString('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }) as string
            };
            const end = {
                x: endAt * unit,
                time: slotEndAt.toLocaleString('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }) as string
            };
            return {
                start,
                end
            };
        });
    }
    return res;
}

export const load: PageServerLoad = async (event) => {
    const { batch, course } = event.params;
    return {
        course: await db.query.courseTable.findFirst({where: eq(courseTable.id, course as 'bos')}),
        // osteopaths,
        availability: flatToWeeks(await availabilityAPI.get(course as 'bos', batch))
    }
};

export const actions: Actions = {
    default: async (event) => {
        const { batch, course } = event.params;
        const defaultAvailability = await availabilityAPI.get(course as 'bos', batch);
        const osteopaths = await db.query.osteopathTable.findMany({
            where: and(eq(osteopathTable.batch, batch), eq(osteopathTable.courseId, course as 'bos'))
        })
        const availabilities = await db.query.availabilityTable.findMany({
            with: {
                osteopath: true
            }
        });
        const byday = groupBy(availabilities, (availability) => availability.day);
        Object.keys(byday).forEach((day) => {
            const availability = byday[day as 'sunday'];
            const osteopathIds = new Set()
            availability.forEach((availability) => osteopathIds.add(availability.osteopathId));
            osteopaths.forEach((osteopath) => {
                if(!osteopathIds.has(osteopath.id)) {
                    db.insert(availabilityTable).values(defaultAvailability[day as 'sunday'].map(({startTime,endTime}) => ({
                        day: day as 'sunday',
                        osteopathId: osteopath.id,
                        startTime,
                        endTime
                    })));
                    osteopathIds.add(osteopath.id);
                }
            })
        })
    }
};