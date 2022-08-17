import './styles/index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './components/Layout'
import { registerServiceWorker } from './serviceWorker/register'
;(async () => {
    await registerServiceWorker()

    const root = createRoot(document.getElementById('root'))

    root.render(<Layout />)
})()
