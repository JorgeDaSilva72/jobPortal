// const Pricing = () => {
//   return (
//     <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
//         <div className="p-6 bg-white border border-indigo-600 shadow-sm rounded-2xl ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12">
//           <div className="text-center">
//             <h2 className="text-lg font-medium text-gray-900">
//               Pro
//               <span className="sr-only">Plan</span>
//             </h2>

//             <p className="mt-2 sm:mt-4">
//               <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
//                 30 FCFA{" "}
//               </strong>

//               <span className="text-sm font-medium text-gray-700">/mois</span>
//             </p>
//           </div>

//           <ul className="mt-6 space-y-2">
//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Annonces illimitées </span>
//             </li>

//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> 5GB de stockage </span>
//             </li>

//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Assistance par e-mail </span>
//             </li>

//             {/* <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Accès au centre d'aide </span>
//             </li> */}

//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Assistance téléphonique </span>
//             </li>
//           </ul>

//           <a
//             href="#"
//             className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
//           >
//             Commencer
//           </a>
//         </div>

//         <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl sm:px-8 lg:p-12">
//           <div className="text-center">
//             <h2 className="text-lg font-medium text-gray-900">
//               Starter
//               <span className="sr-only">Plan</span>
//             </h2>

//             <p className="mt-2 sm:mt-4">
//               <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
//                 Gratuit
//               </strong>

//               {/* <span className="text-sm font-medium text-gray-700">/month</span> */}
//             </p>
//           </div>

//           <ul className="mt-6 space-y-2">
//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> 1 annonce gratuite </span>
//             </li>

//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> 1GB de stockage </span>
//             </li>

//             <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Assistance par e-mail </span>
//             </li>

//             {/* <li className="flex items-center gap-1">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="text-indigo-700 size-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M4.5 12.75l6 6 9-13.5"
//                 />
//               </svg>

//               <span className="text-gray-700"> Help center access </span>
//             </li> */}
//           </ul>

//           <a
//             href="#"
//             className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 bg-white border border-indigo-600 rounded-full hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
//           >
//             Commencer
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pricing;
import { useState } from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro"); // Par défaut, le plan "Pro" est sélectionné

  console.log("selectedPlan:", selectedPlan);
  return (
    <div className="max-w-3xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
        {/* Plan Pro */}
        <div
          onClick={() => setSelectedPlan("Pro")}
          className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
            selectedPlan === "Pro"
              ? "border-indigo-600 ring-8 ring-indigo-600"
              : "border-gray-200"
          }`}
        >
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              Pro
              <span className="sr-only">Plan</span>
            </h2>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                30 FCFA{" "}
              </strong>

              <span className="text-sm font-medium text-gray-700">/mois</span>
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Annonces illimitées </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 5GB de stockage </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance par e-mail </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance téléphonique </span>
            </li>
          </ul>

          <a
            href="#"
            className="block px-12 py-3 mt-8 text-sm font-medium text-center text-white transition duration-200 bg-indigo-600 border border-indigo-600 rounded-full hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
          >
            Commencer
          </a>
        </div>

        {/* Plan Starter */}
        <div
          onClick={() => setSelectedPlan("Starter")}
          className={`p-6 bg-white border shadow-sm rounded-2xl sm:px-8 lg:p-12 cursor-pointer ${
            selectedPlan === "Starter"
              ? "border-indigo-600 ring-8 ring-indigo-600"
              : "border-gray-200"
          }`}
        >
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">
              Starter
              <span className="sr-only">Plan</span>
            </h2>

            <p className="mt-2 sm:mt-4">
              <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Gratuit
              </strong>
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 1 annonce gratuite </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> 1GB de stockage </span>
            </li>

            <li className="flex items-center gap-2">
              <Check className="w-5 h-5 text-indigo-700" />
              <span className="text-gray-700"> Assistance par e-mail </span>
            </li>
          </ul>

          <a
            href="#"
            className="block px-12 py-3 mt-8 text-sm font-medium text-center text-indigo-600 transition duration-200 bg-white border border-indigo-600 rounded-full hover:bg-indigo-100 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          >
            Commencer
          </a>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
