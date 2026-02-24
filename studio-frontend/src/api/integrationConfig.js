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

export async function getPlatformStatus(organizationId, provider) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/platform-status/${provider}`,
    { method: "get" },
    {},
    null,
  )
  return res?.data || null
}

export async function getMediaHosts(organizationId, configId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${configId}/media-hosts`,
    { method: "get" },
    {},
    null,
  )
  return res?.data?.mediaHosts || []
}

export async function createMediaHost(organizationId, configId, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/integration-configs/${configId}/media-hosts`,
    { method: "post" },
    payload,
    null,
  )
  return res
}

export async function generateMediaHostProvisioningToken(organizationId, mediaHostId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/media-hosts/${mediaHostId}/generate-provisioning-token`,
    { method: "post" },
    {},
    null,
  )
  return res
}

export async function generateMediaHostDeployLink(organizationId, mediaHostId) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/media-hosts/${mediaHostId}/generate-deploy-link`,
    { method: "post" },
    {},
    null,
  )
  return res
}

export async function checkMediaHostConnectivity(organizationId, mediaHostId, payload) {
  const res = await sendRequest(
    `${BASE_API}/organizations/${organizationId}/media-hosts/${mediaHostId}/check-connectivity`,
    { method: "post" },
    payload,
    null,
  )
  return res
}

export function getMediaHostSetupScriptUrl(organizationId, mediaHostId, token) {
  return `${BASE_API}/media-hosts/${mediaHostId}/setup-script?token=${encodeURIComponent(token)}`
}

// Admin platform functions
const ADMIN_API = getEnv("VUE_APP_CONVO_API").replace("/api", "/api/administration")

export async function getPlatformIntegrationConfigs() {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform`,
    { method: "get" },
    {},
    null,
  )
  return res?.data?.configs || []
}

export async function createPlatformIntegrationConfig(payload) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform`,
    { method: "post" },
    payload,
    null,
  )
  return res
}

export async function updatePlatformIntegrationConfig(id, payload) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform/${id}`,
    { method: "put" },
    payload,
    null,
  )
  return res
}

export async function deletePlatformIntegrationConfig(id) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform/${id}`,
    { method: "delete" },
    {},
    null,
  )
  return res
}

export async function getPlatformConfigUsage(provider) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform/${provider}/usage`,
    { method: "get" },
    {},
    null,
  )
  return res?.data || null
}

// Admin media host functions
export async function getAdminMediaHosts(configId) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/${configId}/media-hosts`,
    { method: "get" },
    {},
    null,
  )
  return res?.data?.mediaHosts || []
}

export async function createAdminMediaHost(configId, payload) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/${configId}/media-hosts`,
    { method: "post" },
    payload,
    null,
  )
  return res
}

export async function decommissionAdminMediaHost(mediaHostId) {
  const res = await sendRequest(
    `${ADMIN_API}/media-hosts/${mediaHostId}`,
    { method: "delete" },
    {},
    null,
  )
  return res
}

export async function getPlatformIntegrationConfig(id) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform/${id}`,
    { method: "get" },
    {},
    null,
  )
  return res?.data || null
}

export async function validatePlatformCredentials(configId) {
  const res = await sendRequest(
    `${ADMIN_API}/integration-configs/platform/${configId}/validate-credentials`,
    { method: "post" },
    {},
    null,
  )
  return res
}

export async function generateAdminProvisioningToken(mediaHostId) {
  const res = await sendRequest(
    `${ADMIN_API}/media-hosts/${mediaHostId}/generate-provisioning-token`,
    { method: "post" },
    {},
    null,
  )
  return res
}

export async function generateAdminDeployLink(mediaHostId) {
  const res = await sendRequest(
    `${ADMIN_API}/media-hosts/${mediaHostId}/generate-deploy-link`,
    { method: "post" },
    {},
    null,
  )
  return res
}

export async function checkAdminConnectivity(mediaHostId, payload) {
  const res = await sendRequest(
    `${ADMIN_API}/media-hosts/${mediaHostId}/check-connectivity`,
    { method: "post" },
    payload,
    null,
  )
  return res
}

export function getAdminMediaHostSetupScriptUrl(mediaHostId, token) {
  return `${BASE_API}/media-hosts/${mediaHostId}/setup-script?token=${encodeURIComponent(token)}`
}
