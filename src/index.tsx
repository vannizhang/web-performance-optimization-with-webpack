import './styles/index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout/Layout';

(async () => {
    const root = createRoot(document.getElementById('root'));

    root.render(
        <React.StrictMode>
            <Layout />
        </React.StrictMode>
    );
})();