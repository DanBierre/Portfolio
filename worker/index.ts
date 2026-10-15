export interface Env {
  ASSETS: Fetcher;
  EMAIL: SendEmail;
  BRIEF_TO: string;
  BRIEF_FROM: string;
}

export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
