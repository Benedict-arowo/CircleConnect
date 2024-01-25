import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import SocketContext from "./contexts/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<Provider store={store}>
		<ChakraProvider>
			<BrowserRouter>
				<SocketContext>
					<App />
				</SocketContext>
			</BrowserRouter>
		</ChakraProvider>
	</Provider>
	// </React.StrictMode>
);
