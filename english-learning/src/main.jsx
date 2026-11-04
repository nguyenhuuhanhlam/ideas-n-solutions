import '@astryxdesign/core/reset.css'
import '@astryxdesign/core/astryx.css'
import '@astryxdesign/theme-neutral/theme.css'
import '@astryxdesign/theme-neutral/fonts.css'

import { Theme } from '@astryxdesign/core'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { defaultThemeSlug, themes } from '../astryx-themes.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Theme theme={themes[defaultThemeSlug]}>
      <App />
    </Theme>
  </StrictMode>,
)
