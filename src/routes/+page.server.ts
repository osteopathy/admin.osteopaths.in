import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async (event) => {
        const form = await event.request.formData();
        const username = form.get("username");
        const password = form.get("password");
        if(!username || !password) return fail(400);
        event.cookies.set("username", username.toString(),{
            path: '/'
        });
        event.cookies.set("password", password.toString(),{
            path: '/'
        });
        return fail(404,{
            message: "Invalid credentials"
        })
    }
}; 