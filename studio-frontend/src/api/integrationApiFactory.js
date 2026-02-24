import {
  getIntegrationConfig,
  updateIntegrationConfig,
  validateCredentials,
  getMediaHosts,
  createMediaHost,
  generateMediaHostProvisioningToken,
  generateMediaHostDeployLink,
  checkMediaHostConnectivity,
  getMediaHostSetupScriptUrl,
  getPlatformStatus,
  getPlatformIntegrationConfig,
  updatePlatformIntegrationConfig,
  validatePlatformCredentials,
  getAdminMediaHosts,
  createAdminMediaHost,
  generateAdminProvisioningToken,
  generateAdminDeployLink,
  checkAdminConnectivity,
  getAdminMediaHostSetupScriptUrl,
} from "./integrationConfig"

export function createIntegrationApi(scope, organizationId) {
  if (scope === "platform") {
    return {
      updateConfig: (id, payload) => updatePlatformIntegrationConfig(id, payload),
      getConfig: (id) => getPlatformIntegrationConfig(id),
      validateCredentials: (id) => validatePlatformCredentials(id),
      getMediaHosts: (configId) => getAdminMediaHosts(configId),
      createMediaHost: (configId, payload) => createAdminMediaHost(configId, payload),
      genProvisioningToken: (mediaHostId) => generateAdminProvisioningToken(mediaHostId),
      genDeployLink: (mediaHostId) => generateAdminDeployLink(mediaHostId),
      checkConnectivity: (mediaHostId, payload) => checkAdminConnectivity(mediaHostId, payload),
      getSetupScriptUrl: (mediaHostId, token) => getAdminMediaHostSetupScriptUrl(mediaHostId, token),
      getPlatformStatus: () => Promise.resolve(null),
    }
  }

  return {
    updateConfig: (id, payload) => updateIntegrationConfig(organizationId, id, payload),
    getConfig: (id) => getIntegrationConfig(organizationId, id),
    validateCredentials: (id) => validateCredentials(organizationId, id),
    getMediaHosts: (configId) => getMediaHosts(organizationId, configId),
    createMediaHost: (configId, payload) => createMediaHost(organizationId, configId, payload),
    genProvisioningToken: (mediaHostId) => generateMediaHostProvisioningToken(organizationId, mediaHostId),
    genDeployLink: (mediaHostId) => generateMediaHostDeployLink(organizationId, mediaHostId),
    checkConnectivity: (mediaHostId, payload) => checkMediaHostConnectivity(organizationId, mediaHostId, payload),
    getSetupScriptUrl: (mediaHostId, token) => getMediaHostSetupScriptUrl(organizationId, mediaHostId, token),
    getPlatformStatus: (provider) => getPlatformStatus(organizationId, provider),
  }
}
