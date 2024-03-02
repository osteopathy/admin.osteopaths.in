import { PASSWORD, USERNAME } from "$env/static/private";
import { redirect, type Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
    if(event.route.id === '/') {
        redirect(308, '/app')
    }
    // const username = event.cookies.get('username');
    // const password = event.cookies.get('password');

    // if(username !== USERNAME && password !== PASSWORD) {
    //     if(event.route.id !== '/') 
    //         redirect(308,'/')
    // } else {
    //     if(event.route.id === '/') 
            
    // }
    
    return resolve(event);
};