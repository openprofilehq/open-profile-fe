import { ApiErrorType } from "@/api/base";
import {
  defaultShouldDehydrateQuery,
  environmentManager,
  matchQuery,
  MutationCache,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiErrorType;
    mutationMeta: {
      invalidates?: Array<QueryKey>;
      awaits?: Array<QueryKey>;
      toast?: {
        enableError?: boolean;
        title?: string;
      };
    };
  }
}

function makeQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: async (_, __, ___, mutation, options) => {
        options.client.invalidateQueries({
          predicate: (query) =>
            mutation.meta?.invalidates?.some((queryKey) =>
              matchQuery({ queryKey, type: "all" }, query)
            ) ?? false,
        });

        if (mutation.meta?.awaits && mutation.meta.awaits?.length > 0) {
          await options.client.invalidateQueries({
            predicate: (query) =>
              mutation.meta?.awaits?.some((queryKey) =>
                matchQuery({ queryKey, type: "all" }, query)
              ) ?? false,
          });
        }
      },
      // TODO: you can enable this if you want toast on every error by default, with a way to disable it for specific mutations.
      // onError: (err, _, __, ___, ctx) => {
      //   const shouldUseToast = ctx.meta?.toast?.enableError ?? true;
      //   if (shouldUseToast) {
      //     toast.error({
      //       title: ctx.meta?.toast?.title,
      //       description: err.message,
      //     });
      //   }
      // },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 min
        retry: false,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (environmentManager.isServer()) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
