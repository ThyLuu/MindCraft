import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <section className="bg-white min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md px-6 py-12">
                <SignIn />
            </div>
        </section>
    )
}