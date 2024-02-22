import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import SocketContext from "./contexts/SocketContext.tsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<Provider store={store}>
		<ChakraProvider>
			<BrowserRouter>
				<PrimeReactProvider value={{ unstyled: false }}>
					<SocketContext>
						<App />
					</SocketContext>
				</PrimeReactProvider>
			</BrowserRouter>
		</ChakraProvider>
	</Provider>
	// </React.StrictMode>
);
