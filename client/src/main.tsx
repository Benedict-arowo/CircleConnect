import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.tsx";
import { store } from "./store.ts";
import SocketContext from "./contexts/SocketContext.tsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/mira/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./index.css";
import React from "react";
import UserContext from "./contexts/UserContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider>
				<BrowserRouter>
					<PrimeReactProvider>
						<UserContext>
							<SocketContext>
								<App />
							</SocketContext>
						</UserContext>
					</PrimeReactProvider>
				</BrowserRouter>
			</ChakraProvider>
		</Provider>
	</React.StrictMode>
);
