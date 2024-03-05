import { useParams } from "react-router-dom";
import UseFetch from "../Components/Fetch";
import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import Nav from "../Components/Nav";
import { ProjectsType } from "../Components/types";

const Project = () => {
	const { id: projectId } = useParams();
	const [project, setProject] = useState<ProjectsType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [err, setErr] = useState(false);

	const fetchProject = UseFetch({
		url: `project/${projectId}`,
		options: {
			method: "GET",
			useServerUrl: true,
			returnResponse: true,
		},
	});

	useEffect(() => {
		fetchProject
			.then(({ data, response }) => {
				if (!response.ok) throw new Error(data.message);
				setProject(data.data);
				console.log(data);
			})
			.catch((err) => {
				console.log(err);
				setErr(() => true);
			})
			.finally(() => {
				setIsLoading(() => false);
			});
	}, []);
	return (
		<div>
			<Nav className="mb-8" useBackground={false} />
			{isLoading && <Spinner />}
			{err && <div>{err}</div>}
			{!isLoading && project && <div>Project - {project.name}</div>}
		</div>
	);
};

export default Project;
