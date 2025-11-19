'use client';

import { useDatabase } from '@/contexts/databaseContext';
import { useSession } from '@clerk/nextjs';
import { SignedInSessionResource } from '@clerk/types';
import { useEffect, useState } from 'react';
import Onboarding from '@/components/onboarding/onboarding';
import SelectInterests from '@/components/onboarding/selectInterests';
import { Tables } from '@/database/database.types';
import LiveChannels from '@/components/liveChannels/liveChannels';


export default function AppPage() {
    const { session } = useSession();
    const {
        supabase,
        setSupabaseClient,
        getUserData,
        getLivestreams,
        setLivestreamsMockData,
        removeLivestreamsMockData,
    } = useDatabase();
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showSelectInterests, setShowSelectInterests] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ ADD THIS
    const [livestreams, setLivestreams] = useState<Tables<'livestreams'>[]>([]);

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

    useEffect(() => {
        console.log('Session', session?.user.id);
        if (supabase && session?.user.id) {
            getUserData(session?.user.id).then((user) => {
                if (user) {
                    console.log(user);
                    console.log('Interests:', user.interests); // ✅ ADD DEBUG LOG
                    console.log('Interests length:', user.interests?.length); // ✅ ADD DEBUG LOG

                    if (!user.interests || user.interests.length === 0 || user.interests === '[]') {
                        // ✅ CHANGED THIS LINE
                        setShowOnboarding(false);
                        setShowSelectInterests(true);
                    } else {
                        setShowOnboarding(false);
                        setShowSelectInterests(false);
                        getLivestreams().then((livestreams) => {
                            setLivestreams(livestreams);
                        })
                    }
                } else {
                    setShowOnboarding(true);
                }
            });
        }
    }, [supabase, session?.user.id, getUserData, refreshTrigger]); // ✅ ADD refreshTrigger

    // ✅ ADD THIS FUNCTION
    const handleInterestsSaved = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (showOnboarding) {
        return <Onboarding />;
    }

    if (showSelectInterests) {
        return <SelectInterests onSaved={handleInterestsSaved} />; // ✅ ADD onSaved PROP
    }

    return (
        <section className='flex items-center justify-center'>
            <h1>App is running</h1>
            <LiveChannels livestreams={livestreams} />
            <button onClick={() => setLivestreamsMockData()}>
                Set Livestreams Mock Data
            </button>
            <button onClick={() => removeLivestreamsMockData()}>
                Remove Livestreams Mock Data
            </button>
        </section>
    );
}