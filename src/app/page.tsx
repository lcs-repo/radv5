import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the Radiology Dashboard
        </h1>

        <p className="mt-3 text-2xl">
          Get started by logging in or viewing the dashboard
        </p>

        <div className="flex mt-6">
          <Link href="/pages/login" className="mx-4 px-6 py-3 rounded-md bg-blue-500 text-white">
            Login
          </Link>
          <Link href="/pages/dashboard" className="mx-4 px-6 py-3 rounded-md bg-green-500 text-white">
            View Dashboard
          </Link>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
}
