import { sendRequest } from "../tools/sendRequest"
import { getEnv } from "@/tools/getEnv"

const BASE_API = getEnv("VUE_APP_CONVO_API")

export async function getIntegrationConfigs(organizationId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs`,
    { method: "get" },
    {},
    null,
  )

  return res?.data?.configs || []
}

export async function getIntegrationConfig(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}`,
    { method: "get" },
    {},
    null,
  )

  return res?.data || null
}

export async function createIntegrationConfig(organizationId, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs`,
    { method: "post" },
    payload,
    null,
  )

  return res
}

export async function updateIntegrationConfig(organizationId, id, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}`,
    { method: "put" },
    payload,
    null,
  )

  return res
}

export async function deleteIntegrationConfig(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}`,
    { method: "delete" },
    {},
    null,
  )

  return res
}

export async function validateCredentials(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}/validate-credentials`,
    { method: "post" },
    {},
    null,
  )

  return res
}

export async function generateProvisioningToken(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}/generate-provisioning-token`,
    { method: "post" },
    {},
    null,
  )

  return res
}

export async function generateDeployLink(organizationId, id) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}/generate-deploy-link`,
    { method: "post" },
    {},
    null,
  )

  return res
}

export async function checkConnectivity(organizationId, id, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${id}/check-connectivity`,
    { method: "post" },
    payload,
    null,
  )

  return res
}

export function getSetupScriptUrl(organizationId, id, token) {
  return `${BASE_API}/organizations/${organizationId}/integration-configs/${id}/setup-script?token=${encodeURIComponent(token)}`
}
