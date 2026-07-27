export default function Hero() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Take Control of Your Student Budget
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Track your spending, manage your dining dollars, and stay on top of
          your finances—all in one place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
            Get Started
          </button>

          <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}