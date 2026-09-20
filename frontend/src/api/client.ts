import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import type { paths } from './schema'

// Paths in the generated schema already include the "/api" prefix (it's
// part of the backend's actual @RequestMapping), so the base URL is left
// empty - requests go out as e.g. "/api/products", which the Vite dev
// proxy forwards to the backend unchanged.
const fetchClient = createFetchClient<paths>({ baseUrl: '' })

export const $api = createClient(fetchClient)
