export default function Demo() {
  return (
    <section className="bg-gray-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            See Your Budget at a Glance
          </h2>

          <p className="mt-4 text-gray-600">
            View spending trends, remaining budget, and dining dollars from one
            simple dashboard.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-6">
              <p className="text-sm text-gray-500">Monthly Budget</p>
              <h3 className="mt-2 text-3xl font-bold">$850</h3>
            </div>

            <div className="rounded-lg bg-green-50 p-6">
              <p className="text-sm text-gray-500">Remaining</p>
              <h3 className="mt-2 text-3xl font-bold">$320</h3>
            </div>

            <div className="rounded-lg bg-yellow-50 p-6">
              <p className="text-sm text-gray-500">Dining Dollars</p>
              <h3 className="mt-2 text-3xl font-bold">$185</h3>
            </div>
          </div>

          <div className="mt-8 flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
            Budget Charts Coming Soon
          </div>
        </div>
      </div>
    </section>
  );
}