import { createStore } from "@cvte/ai-web-util/store";
import User from './user';
import AbilityC from './abilityC';

const { useStore, StoreProvider } = createStore({
    User,
    AbilityC
});
export {
    useStore,
    StoreProvider
};
