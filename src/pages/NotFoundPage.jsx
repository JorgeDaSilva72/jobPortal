import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-4 text-6xl font-bold text-red-600">404</h1>
      <p className="mb-8 text-xl text-gray-700">
        Oups ! La page que vous recherchez n&apos;existe pas.
      </p>
      <Link
        to="/"
        className="px-6 py-3 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Retour à la page d&apos;accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;
