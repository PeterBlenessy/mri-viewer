// Shim for globalthis package to provide default export
// vtk.js expects: import globalThis from 'globalthis'
// but the globalthis package only has named exports
export default globalThis
