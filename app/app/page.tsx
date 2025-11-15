'use client';


import { useDatabase } from '@/contexts/databaseContext';
import { useSession } from '@clerk/nextjs';
import { SignedInSessionResource } from '@clerk/types';
import { useEffect } from 'react';



export default function AppPage() {
    const { session } = useSession();
    const { supabase, setSupabaseClient, } = useDatabase();

    useEffect(() => {
        async function initializeSupabase(session: SignedInSessionResource) {
            const token = (await session?.getToken()) as string;
            if (token) {
                setSupabaseClient(token);
            }
        }

        if (session && !supabase) {
            initializeSupabase(session);
        } else {
            console.log('No clerk session');
        }
    }, [session, setSupabaseClient, supabase]);


    return (
        <section className='flex items-center justify-center'>
            <h1>App is running</h1>
        </section>
    )
}
