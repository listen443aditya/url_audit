// // src/components/layout/Footer.tsx
// import React from "react";

// export const Footer: React.FC = () => {
//   return (
//     <footer className="w-full py-6 mt-auto border-t border-slate-200 bg-white">
//       <div className="max-w-4xl mx-auto px-4 text-center">
//         <p className="text-sm text-slate-500 font-medium">
//           Built for Digital Heroes Training Task -{" "}
//           <a
//             href="https://digitalheroesco.com"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
//           >
//             digitalheroesco.com
//           </a>
//         </p>
//       </div>
//     </footer>
//   );
// };
// page-pulse-ui/src/components/layout/Footer.tsx
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="w-full py-6 text-center text-sm text-slate-500 bg-white border-t border-slate-200 transition-colors">
    <p>
      Built for Digital Heroes Training Task -{' '}
      <a 
        href="https://digitalheroesco.com" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
      >
        digitalheroesco.com
      </a> By Aditya Kumar Singh
    </p>
  </footer>
);