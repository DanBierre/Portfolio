import { handleBrief } from './brief';

export interface Env {
  ASSETS: Fetcher;
  EMAIL: SendEmail;
  BRIEF_TO: string;
  BRIEF_FROM: string;
}

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/brief') return handleBrief(request, env);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
