// React.lazy currently only supports default exports
// Sp we just re-export the named global nav one as the default
// See https://reactjs.org/docs/code-splitting.html#named-exports
export { Header as default } from "@nice-digital/global-nav";
