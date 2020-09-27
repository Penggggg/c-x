import { createStore } from "@cvte/ai-web-util/store";
import UserRole from './role';

const { useStore, StoreProvider } = createStore({
    UserRole
});
export {
    useStore,
    StoreProvider
};
