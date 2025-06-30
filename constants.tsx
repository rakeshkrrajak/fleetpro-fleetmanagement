

import React from 'react'; // Required for JSX
import { NavigationItem } from './types';

export const APP_NAME = "FleetPro";

// Icon components
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12v10.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v6a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V12m-16.5 0a1.5 1.5 0 01-1.06-2.56l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955a1.5 1.5 0 01-1.06 2.56H2.25z" />
  </svg>
);

export const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 0h5.25m-5.25 0V3.375M5.25 7.5h9" />
  </svg>
);

export const UserGroupIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Also used for Mechanics Directory
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.066M12 12a3 3 0 100-6 3 3 0 000 6zM21 12c0 1.683-.607 3.228-1.606 4.418M3.982 18.72a9.095 9.095 0 003.741-.479 3 3 0 00-3.741-5.066M12 12a3 3 0 100-6 3 3 0 000 6zM3 12c0 1.683.607 3.228 1.606 4.418m13.018-9.919A3 3 0 0013.965 3.06a3 3 0 00-2.436.505M17.65 18.61a3 3 0 00-3.262-.779M6.35 18.61a3 3 0 01-3.262-.779" />
  </svg>
);

export const CogIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.894c-.09.542-.56.94-1.11-.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.894c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.894z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const MapPinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

export const GlobeAltIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const DevicePhoneMobileIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

export const RouteIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.006C17.328 17.442 18 16.526 18 15.482V8.518c0-1.044-.672-1.96-1.5-2.524m-6 12.012C7.672 17.442 7 16.526 7 15.482V8.518c0-1.044.672-1.96 1.5-2.524M4.5 15.482V8.518a3.001 3.001 0 012.353-2.943m10.294 0a3.001 3.001 0 012.353 2.943v6.964a3.001 3.001 0 01-2.353 2.943m-10.294 0a3.001 3.001 0 00-2.353-2.943m10.294 0c1.171-.064 2.29-.203 3.338-.406M4.5 8.518c-1.171-.064-2.29-.203-3.338-.406" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.626c0 1.826-.822 3.484-2.072 4.5M4.5 8.626C4.5 6.799 5.322 5.14 6.572 4.126M12 6.092V4.5m0 15v-1.592" />
    </svg>
);

export const ClipboardListIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Used for Maintenance Tasks & Alert Log
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const BellAlertIcon = (props: React.SVGProps<SVGSVGElement>) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
  </svg>
);

export const CurrencyDollarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const DocumentChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Cost Dashboard
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h16.5M3.75 16.5V21M6 16.5h1.875a1.125 1.125 0 011.125 1.125V21M9.75 16.5h1.875a1.125 1.125 0 011.125 1.125V21M13.5 16.5h1.875a1.125 1.125 0 011.125 1.125V21M17.25 3v11.25c0 .621-.504 1.125-1.125 1.125H6.375c-.621 0-1.125-.504-1.125-1.125V3M10.5 6.75h3M10.5 9.75h3m-3.75 3A.75.75 0 016 12h12a.75.75 0 010 1.5H6a.75.75 0 01-.75-.75z" />
  </svg>
);

export const DocumentTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const TagIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Cost Categories
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

export const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Cost Entry
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
</svg>
);

export const FireIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Fuel Log
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.973 5.973 0 00-2.293 4.217A3.75 3.75 0 0012 18z" />
</svg>
);

export const WrenchIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Maintenance parent menu
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.83-5.83M11.42 15.17A3 3 0 016.344 12.16l-3.486-3.486A2.652 2.652 0 012.86 5.83l5.83 5.83A3 3 0 0111.42 15.17z" />
  </svg>
);

export const ChartBarIcon = (props: React.SVGProps<SVGSVGElement>) => ( // For Fleet Overview Page
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const LightBulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.311V21A2.25 2.25 0 0112 23.25v0A2.25 2.25 0 019.75 21v-2.311m0-11.422c.621-.433 1.28-.796 2.006-1.093V3.75a.75.75 0 011.5 0v1.875a10.496 10.496 0 014.282 3.085M12 18M3.75 9.75h16.5M12 3.75c.621 0 1.17.038 1.696.11M3.75 3.75c-.621 0-1.17.038-1.696.11m0 0A10.523 10.523 0 013 5.625m18 0c.348.463.64.966.886 1.493m0 0a10.496 10.496 0 01-.886-1.493M9.75 9.75c0 1.25.014 2.49.042 3.729M14.25 9.75c0 1.25-.014 2.49-.042 3.729m0 0c-.025.992-.074 1.972-.146 2.936m-4.252 0c-.072-.964-.121-1.944-.146-2.936" />
  </svg>
);

export const ChartPieIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
  </svg>
);

export const EnvelopeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const ArrowDownTrayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Icons for Wholesale Finance
export const BuildingStorefrontIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A.75.75 0 0114.25 12h.75a.75.75 0 01.75.75v7.5m0 0H21A.75.75 0 0021.75 20.25V18a.75.75 0 00-.75-.75h-2.25m-7.5 0h-2.25A.75.75 0 003 17.25V20.25c0 .414.336.75.75.75H10.5m0-7.5V13.5A.75.75 0 0111.25 12h1.5a.75.75 0 01.75.75v1.5m-7.5 0V5.625c0-1.036.84-1.875 1.875-1.875h.375c1.036 0 1.875.84 1.875 1.875v1.5m0 0h1.5m-1.5 0h.375c1.036 0 1.875.84 1.875 1.875v1.5m0 0h1.5m-1.5 0h.375c1.036 0 1.875.84 1.875 1.875v1.5m0 0h1.5m-1.5 0h.375c1.036 0 1.875.84 1.875 1.875v1.5M4.5 5.625v1.5m0 0h1.5m-1.5 0h.375c1.036 0 1.875.84 1.875 1.875v1.5m0 0h1.5m-1.5 0h.375c1.036 0 1.875.84 1.875 1.875v1.5m0 0h1.5" />
    </svg>
);

export const BanknotesIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h-4.875a1.125 1.125 0 00-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h4.875m-18 0h4.875a1.125 1.125 0 011.125 1.125v11.25c0-.621-.504-1.125-1.125-1.125h-4.875m18 0v-11.25c0-.621-.504-1.125-1.125-1.125h-4.875a1.125 1.125 0 00-1.125 1.125v11.25" />
    </svg>
);

export const RectangleStackIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 15.25l5.571-3m-11.142 0l-2.143 1.125m11.142 0l2.143 1.125m-11.142 0l-2.143-1.125m11.142 0l2.143-1.125" />
    </svg>
);

export const ClipboardDocumentCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25L15 7.125m-4.875 0h.008v.008h-.008V7.125m-4.875 0h.008v.008h-.008V7.125m-4.875 0h.008v.008h-.008V7.125m-4.875 0h.008v.008h-.008V7.125m-4.875 0h.008v.008h-.008V7.125m-4.875 0h.008v.008h-.008V7.125M15 13.5l-3 3-1.5-1.5" />
    </svg>
);



export const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Dashboard", path: "/", icon: HomeIcon },
  { name: "Fleet Overview", path: "/fleet-overview", icon: ChartBarIcon },
  { name: "Advanced Insights", path: "/advanced-insights", icon: LightBulbIcon },
  { name: "Vehicles", path: "/vehicles", icon: TruckIcon },
  { name: "Drivers", path: "/drivers", icon: UserGroupIcon },
  { name: "Trips", path: "/trips", icon: RouteIcon },
  { 
    name: "Maintenance", 
    path: "/maintenance", 
    icon: WrenchIcon,
    children: [
        { name: "Maintenance Dashboard", path: "/maintenance/dashboard", icon: ChartPieIcon },
        { name: "Maintenance Tasks", path: "/maintenance/tasks", icon: ClipboardListIcon },
        { name: "Mechanics Directory", path: "/maintenance/mechanics", icon: UserGroupIcon },
    ]
  },
  { 
    name: "Cost Management", 
    path: "/costs", 
    icon: CurrencyDollarIcon,
    children: [
        { name: "Cost Dashboard", path: "/costs/dashboard", icon: DocumentChartBarIcon },
        { name: "Fuel Dashboard", path: "/costs/fuel-dashboard", icon: ChartPieIcon },
        { name: "Cost Categories", path: "/costs/categories", icon: TagIcon },
        { name: "Vehicle Costs", path: "/costs/vehicle-entry", icon: CreditCardIcon },
        { name: "Fuel Log", path: "/costs/fuel-log", icon: FireIcon },
    ]
  },
  { 
    name: "Telematics", 
    path: "/telematics", 
    icon: BellAlertIcon,
    children: [
        { name: "Alerts Dashboard", path: "/telematics/dashboard", icon: ChartPieIcon },
        { name: "Alerts Log", path: "/telematics/log", icon: ClipboardListIcon },
        { name: "Email Log", path: "/telematics/email-log", icon: EnvelopeIcon },
    ]
  },
  { 
    name: "Safety & Compliance", 
    path: "/safety", 
    icon: ShieldCheckIcon,
    children: [
        { name: "Safety Dashboard", path: "/safety/dashboard", icon: ChartPieIcon },
        { name: "Document Compliance", path: "/safety/documents", icon: DocumentTextIcon },
    ]
  },
  { name: "User Management", path: "/user-management", icon: UserGroupIcon }, 
  { name: "Map Overview", path: "/map", icon: MapPinIcon },
  { name: "Settings", path: "/settings", icon: CogIcon },
];

export const WHOLESALE_NAVIGATION_ITEMS: NavigationItem[] = [
  { name: "Dashboard", path: "/wholesale/dashboard", icon: HomeIcon },
  { name: "Dealerships", path: "/wholesale/dealerships", icon: BuildingStorefrontIcon },
  { name: "Credit Lines", path: "/wholesale/credit-lines", icon: BanknotesIcon },
  { name: "Floor Plan (Inventory)", path: "/wholesale/inventory", icon: RectangleStackIcon },
  { name: "Audits", path: "/wholesale/audits", icon: ClipboardDocumentCheckIcon },
];


export const MOCK_VEHICLES_COUNT = 37;
export const MOCK_DRIVERS_COUNT = 19; 
export const MOCK_USERS_COUNT = 4; 
export const MOCK_TRIPS_COUNT = 5; 
export const MOCK_ALERTS_MAX_PER_VEHICLE = 2;
export const MOCK_INITIAL_EMAILS_TO_GENERATE = 25; // For TelematicsEmailLogPage

export const MOCK_COST_CATEGORIES_COUNT = 5;
export const MOCK_COST_ENTRIES_COUNT = 20;
export const MOCK_FUEL_LOGS_COUNT = 15;

export const MOCK_MAINTENANCE_TASKS_COUNT = 10;
export const MOCK_MECHANICS_COUNT = 5;

// Wholesale Finance Mock Data Counts
export const MOCK_DEALERSHIPS_COUNT = 8;
export const MOCK_INVENTORY_UNITS_PER_DEALER = 10;
export const MOCK_AUDITS_COUNT = 4;

// Gemini Model Names
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export const DEFAULT_PLACEHOLDER_IMAGE_SIZE = 200;
export const DEFAULT_DRIVER_PLACEHOLDER_IMAGE_URL = `https://placehold.co/${DEFAULT_PLACEHOLDER_IMAGE_SIZE}x${DEFAULT_PLACEHOLDER_IMAGE_SIZE}/075985/e0f2fe?text=D&font=montserrat`;


// Map constants (Bangalore specific for MapOverviewPage)
export const BANGALORE_CENTER_LAT = 12.9716;
export const BANGALORE_CENTER_LON = 77.5946;
export const BANGALORE_MAP_COORD_VARIATION_LAT = 0.15; 
export const BANGALORE_MAP_COORD_VARIATION_LON = 0.20; 
export const TELEMETRY_MAP_UPDATE_STEP = 0.005; 


// Simulation constants
export const TELEMETRY_SIMULATION_INTERVAL = 7000; 
export const ALERT_GENERATION_INTERVAL = 15000; 
export const MAX_SIMULATED_SPEED_KMPH = 90;
export const MIN_SIMULATED_SPEED_KMPH = 0;
export const IDLE_SPEED_THRESHOLD_KMPH = 5; 
export const SPEEDING_THRESHOLD_KMPH = 70;
export const MAINTENANCE_DUE_DAYS_THRESHOLD = 7;
export const MAX_SIMULATED_EMAILS = 100; // Max emails to keep in log