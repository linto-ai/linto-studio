import { CorePlugin, LLMService, LLMServiceInit, LLMServiceStatus, LLMServiceVersion, LLMServiceGeneration, LLMServicesPluginApi } from '../../core/types';
import { default as LLMServicePanel } from './LLMServicePanel.vue';
export type { LLMService, LLMServiceInit, LLMServiceStatus, LLMServiceVersion, LLMServiceGeneration, LLMServicesPluginApi, };
export { LLMServicePanel };
export declare function createLLMServicesPlugin(): CorePlugin;
