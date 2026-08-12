const productionBaseUrl =
  'https://us-central1-overpatch-helpdesk.cloudfunctions.net/api/v1';

export const HELPDESK_BASE_URL = (
  import.meta.env.PUBLIC_HELPDESK_BASE_URL ?? productionBaseUrl
).replace(/\/$/, '');

export const HELPDESK_INTAKE_URL = `${HELPDESK_BASE_URL}/inquiries`;
