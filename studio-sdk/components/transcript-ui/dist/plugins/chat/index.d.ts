import { CorePlugin, ChatMessage, ChatSession, ChatPluginApi } from '../../core/types';
import { default as ChatDrawer } from './ChatDrawer.vue';
export type { ChatMessage, ChatSession, ChatPluginApi };
export { ChatDrawer };
/**
 * Chat plugin — state container only, no network.
 *
 * The UI emits intents (`chat:send`, `chat:loadSession`, …) via `core.emit`,
 * the host listens, performs the HTTP/SSE calls, and pushes results back
 * through the setters below. Mirrors the `llmServices` plugin design.
 */
export declare function createChatPlugin(): CorePlugin;
