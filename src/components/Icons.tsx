import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function RodentIcon() {
  return (
    <svg {...base} id="Line_Expand" height="512" viewBox="0 0 64 64" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Line Expand"><circle cx="55" cy="29" r="1"/><path d="m63.38 31.61a18.867 18.867 0 0 0 -6.222-6.339 4.641 4.641 0 0 0 .592-2.271 4.749 4.749 0 0 0 -9.119-1.86 73.943 73.943 0 0 0 -19.992-4.82c-4.264-.352-10.709.6-14.816 4.406a10.731 10.731 0 0 0 -3.534 7.524h-.289a9.761 9.761 0 0 0 -9.75 9.75 5.757 5.757 0 0 0 5.75 5.75h27a1.25 1.25 0 0 1 0 2.5h-8a.75.75 0 0 0 0 1.5h8a2.75 2.75 0 0 0 0-5.5h-27a4.255 4.255 0 0 1 -4.25-4.25 8.259 8.259 0 0 1 8.25-8.25h.288a9.744 9.744 0 0 0 9.712 9h8a.75.75 0 0 0 .75-.75 4.693 4.693 0 0 0 -.591-2.25h11.706a4.749 4.749 0 0 0 4.414 3h8.721a.75.75 0 0 0 .75-.75 4.693 4.693 0 0 0 -.591-2.25h7.779a2.783 2.783 0 0 0 2.439-1.393 2.722 2.722 0 0 0 .003-2.747zm-1.3 1.99a1.3 1.3 0 0 1 -1.142.645h-9.053a4.706 4.706 0 0 0 -2.885-1h-3.459l-.83-2.487a.749.749 0 0 0 -1.422.474l1 3a.75.75 0 0 0 .711.518h4a3.256 3.256 0 0 1 3.163 2.5h-7.884a3.251 3.251 0 0 1 -3.187-2.613l-.357-1.784a.749.749 0 0 0 -.882-.588.749.749 0 0 0 -.587.882l.22 1.1h-12.6a4.706 4.706 0 0 0 -2.885-1h-1.293a6.907 6.907 0 0 0 -5.56-5.985.75.75 0 0 0 -.3 1.47l.1.02a5.363 5.363 0 0 1 4.302 5.248.75.75 0 0 0 .75.75h2a3.256 3.256 0 0 1 3.163 2.5h-7.163a8.25 8.25 0 0 1 -8.25-8.25h.007a9.345 9.345 0 0 1 3.086-7.169c3.749-3.474 9.712-4.327 13.675-4.011a72.741 72.741 0 0 1 19.771 4.8c-.01.131-.039.256-.039.389a4.751 4.751 0 0 0 .636 2.376.75.75 0 1 0 1.3-.752 3.25 3.25 0 1 1 6.064-1.633 3.2 3.2 0 0 1 -.727 2.019.753.753 0 0 0 .189 1.108 17.91 17.91 0 0 1 6.367 6.229 1.224 1.224 0 0 1 .001 1.244z"/></svg>
  )
}

export function BugIcon() {
  return (
    <svg {...base}>
      <path d="M9.5 6.6a2.5 2.5 0 0 1 5 0" />
      <rect x="7" y="7.5" width="10" height="13" rx="5" />
      <path d="M12 9.5v11" />
      <path d="M7 11.5 4 10M17 11.5l3-1.5M7 15H3.5M17 15h3.5M7.6 18.6 5 21M16.4 18.6 19 21" />
      <path d="M10.6 4.6 8.6 2.2M13.4 4.6l2-2.4" />
    </svg>
  )
}

export function MicrobeIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="5.2" />
      <path d="M16.8 14 19 14.9M14 16.8l.9 2.2M10 16.8l-.9 2.2M7.2 14 5 14.9M7.2 10 5 9.1M10 7.2 9.1 5M14 7.2l.9-2.2M16.8 10l2.2-.9" />
      <circle cx="19.9" cy="15.3" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="19.9" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.7" cy="19.9" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="4.1" cy="15.3" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="4.1" cy="8.7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8.7" cy="4.1" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15.3" cy="4.1" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="19.9" cy="8.7" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="10.6" cy="11" r="1.1" />
      <circle cx="13.9" cy="13.7" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}
