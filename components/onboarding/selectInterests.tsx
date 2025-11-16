import { useDatabase } from '@/contexts/databaseContext';
import { Interest, interests } from '@/lib/types/interest';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';


export default function SelectInterests() {
    const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
    const [isOpen, setIsOpen] = useState(true);

    const { setUserInterests } = useDatabase();
    const { user } = useUser();

    if (!isOpen) return null;

    return (
        <section className='fixed inset-0 z-50 flex items-center justify-center bg-twitch-ice bg-opacity-50'>
            <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl mx-8 relative text-black'>
                <h1 className='text-2xl font-bold p-6 text-center'>
                    What are you into?
                </h1>
                <p className='text-center text-sm mb-6 px-6'>
                    Choose 1 or more categories of channels being streamed right now.
                </p>
                <div>
                    <div className='grid grid-cols-5 gap-3 p-6'>
                        {interests.map((interest) => (
                            <button
                                key={interest.id}
                                style={{ backgroundColor: interest.color }}
                                onClick={() => {
                                    if (selectedInterests.includes(interest)) {
                                        setSelectedInterests(
                                            selectedInterests.filter((i) => i.id !== interest.id)
                                        );
                                    } else {
                                        setSelectedInterests([...selectedInterests, interest]);
                                    }
                                }}
                            >
                            </button>
                        ))}
          </div>
                </div>
            </div>
        </section>
    );
}