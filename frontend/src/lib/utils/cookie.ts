'use server'
import { cookies } from 'next/headers';

/**
 * Get a cookie value by name
 * @param {string} name The name of the cookie to retrieve
 * @returns {string | undefined} The cookie value or undefined if not found
 */
export const getCookie = async (name: string) => {
    const cookieStore = await cookies()
    const token = cookieStore.get(name)?.value;
    return token;
};

/**
 * Set a cookie with the given name and value
 * @param {string} name The name of the cookie
 * @param {string} value The value to set for the cookie
 */
export const setCookie = async (name: string, value: string) => {
    const cookieStore = await cookies()
    cookieStore.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * Number(process.env.NEXT_PUBLIC_AUTH_TOKEN_EXPIRES_IN_DAYS), 
        path: '/',
    });
};

/**
 * Delete a cookie by name
 * @param {string} name The name of the cookie to delete
 */
export const deleteCookie = async (name: string) => {
    const cookieStore = await cookies()
    cookieStore.set(name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Immediately expire the cookie
        path: '/',
    });
};
