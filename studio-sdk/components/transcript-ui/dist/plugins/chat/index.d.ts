import { CorePlugin, ChatMessage, ChatDiscussion, ChatPluginApi } from '../../core/types';
export type { ChatMessage, ChatDiscussion, ChatPluginApi };
/**
 * Chat plugin — state container only, no network.
 *
 * The UI emits intents (`chat:send`, `chat:loadDiscussions`, …) via `core.emit`,
 * the host listens, performs the HTTP/SSE calls, and pushes results back
 * through the setters below. Mirrors the `llmServices` plugin design.
 */
export declare function createChatPlugin(): CorePlugin;
