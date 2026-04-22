type EventHandler<EventMap, K extends keyof EventMap> = (payload: EventMap[K]) => void;
export declare function createEventBus<EventMap>(): {
    on: <K extends keyof EventMap>(event: K, handler: EventHandler<EventMap, K>) => () => void;
    off: <K extends keyof EventMap>(event: K, handler: EventHandler<EventMap, K>) => void;
    emit: <K extends keyof EventMap>(event: K, payload: EventMap[K]) => void;
    clear: () => void;
};
export {};
