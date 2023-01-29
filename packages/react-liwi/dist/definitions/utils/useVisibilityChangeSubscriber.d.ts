type VisibilityChangeHandler = () => void;
interface VisibilityChangeSubscriber {
    subscribe: (handleVisibilityChange: VisibilityChangeHandler) => void;
    unsubscribe: () => void;
}
export declare const useVisibilityChangeSubscriber: () => VisibilityChangeSubscriber;
export {};
//# sourceMappingURL=useVisibilityChangeSubscriber.d.ts.map