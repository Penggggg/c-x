import { createStore } from "@cvte/ai-web-util/store";
import LabelImg from './labelImg';
import User from './user'

const { useStore, StoreProvider } = createStore({
    User,
    LabelImg
});
export {
    useStore,
    StoreProvider
};
