/**
 * SIMASDATA Theme Configuration
 *
 * This file controls the theme behavior for your website.
 * Change these settings to customize how theming works.
 */

export const THEME_CONFIG = {
  // MANUAL THEME CONTROL
  // Set this to override user preferences and force a specific theme
  FORCE_THEME: 'light' as 'light' | 'dark' | null, // null = allow user choice

  // THEME TOGGLE VISIBILITY
  // Set to true when you're ready to show the theme toggle to users
  SHOW_THEME_TOGGLE: false,

  // DEFAULT THEME
  // What theme to use if no user preference is stored (when FORCE_THEME is null)
  DEFAULT_THEME: 'light' as 'light' | 'dark' | 'system',

  // RESPECT SYSTEM PREFERENCES
  // Whether to respect user's OS dark/light mode preference (when FORCE_THEME is null)
  RESPECT_SYSTEM_PREFERENCE: true,
};

/**
 * QUICK SETUP GUIDE:
 *
 * 1. FOR LIGHT MODE ONLY (current setup):
 *    - FORCE_THEME: 'light'
 *    - SHOW_THEME_TOGGLE: false
 *
 * 2. TO ENABLE DARK MODE TOGGLE:
 *    - FORCE_THEME: null
 *    - SHOW_THEME_TOGGLE: true
 *
 * 3. FOR DARK MODE ONLY:
 *    - FORCE_THEME: 'dark'
 *    - SHOW_THEME_TOGGLE: false
 *
 * 4. FOR AUTO SYSTEM DETECTION:
 *    - FORCE_THEME: null
 *    - DEFAULT_THEME: 'system'
 *    - RESPECT_SYSTEM_PREFERENCE: true
 */