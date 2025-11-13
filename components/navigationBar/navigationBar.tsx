import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs"

export default function NavigationBar() {
    return (
        <header>
            <nav className='w-full flex text-black items-center justify-between bg-white p-2 border-b border-slate-300'>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton />                    
                </SignedOut>
                <SignedIn>
                    <SignOutButton />
                </SignedIn>
            </nav>
        </header>
    )
}