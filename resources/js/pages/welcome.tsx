import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {  Brain  } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">

                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex h-100 w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">


                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="mb-2 text-2xl font-semibold flex items-center gap-2 text-[#1b1b18] dark:text-[#EDEDEC]">
                                        <Brain className="h-6 w-6" />
                                        Millennium AI Chatbot
                                    </h1>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                        Meet your new AI assistant - designed to understand, assist, and engage in meaningful conversations.
                                        <br />
                                        From answering questions to helping with complex tasks, always ready to help. Powered by Meta's Llama 3.2 model.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('login')}
                                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                            >
                                                Log in
                                            </Link>
                                            <Link
                                                href={route('register')}
                                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Millennium logo */}
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-white lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#161615]">
                            <img
                                src="/millennium_logo_svg.svg"
                                alt="Millennium Logo"
                                className="h-50 absolute inset-0 m-auto object-contain dark:invert"
                            />
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
