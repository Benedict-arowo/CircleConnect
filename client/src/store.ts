import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./pages/Auth/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
	key: "root",
	storage,
};

const rootReducer = combineReducers({
	user: persistReducer(persistConfig, userSlice),
});

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV !== "production",
	middleware: [thunk],
});

export const persistor = persistStore(store);
// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
// import userSlice from "./pages/Auth/userSlice";

// const persistConfig = {
// 	key: "root",
// 	storage,
// };

// const rootReducer = {
// 	user: userSlice,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export default () => {
// 	let store = configureStore(persistedReducer);
// 	let persistor = persistStore(store);
// 	return { store, persistor };
// };

// // export const store = configureStore({
// // 	reducer: {
// // 		user: userSlice,
// // 	},
// // });

// // // Infer the `RootState` and `AppDispatch` types from the store itself
// // export type RootState = ReturnType<typeof store.getState>;
// // // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// // export type AppDispatch = typeof store.dispatch;
