import { googleJson } from './auth.js';

export function createWorkflowsEscalation({ auth, projectId, location, workflow = 'saathi-escalation', callbackUrl, fetchImpl = fetch } = {}) {
  const url = `https://workflowexecutions.googleapis.com/v1/projects/${projectId}/locations/${location}/workflows/${workflow}/executions`;
  return {
    kind: 'google-cloud-workflows',
    async start(input) {
      const out = await googleJson(fetchImpl, auth, url, { body: { argument: JSON.stringify({ ...input, callbackUrl }), callLogLevel: 'LOG_ERRORS_ONLY' } });
      return out.name;
    },
  };
}
