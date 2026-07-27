export default function Footer() {
  return (
    <footer className="border-t bg-white px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
        <p>© {new Date().getFullYear()} TritonBudget. All rights reserved.</p>

        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-900">
            About
          </a>

          <a href="#" className="hover:text-gray-900">
            Contact
          </a>

          <a href="#" className="hover:text-gray-900">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}