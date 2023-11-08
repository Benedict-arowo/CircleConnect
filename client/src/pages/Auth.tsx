import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const Auth = () => {
	return (
		<div>
			<div>
				<Tabs size="md" variant="enclosed">
					<TabList>
						<Tab>Login</Tab>
						<Tab>Register</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<p>Login</p>
						</TabPanel>
						<TabPanel>
							<p>Register</p>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</div>
	);
};

export default Auth;
