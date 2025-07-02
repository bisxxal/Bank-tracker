'use client'
 
import { SessionProvider } from 'next-auth/react'


type Props = { children: React.ReactNode }

// const client = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: false,
//       refetchOnMount: false,
//       refetchOnReconnect: false,
//       refetchInterval: false,
//       staleTime:  Infinity 
//     }
//   }
// })

const Providers = ({ children }: Props) => {
  return (
//   <QueryClientProvider client={client}>
    <SessionProvider>{children}</SessionProvider>
)
  {/* </QueryClientProvider> */}
}

export default Providers