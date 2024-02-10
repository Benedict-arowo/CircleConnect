import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button } from "@chakra-ui/react";
// import { AiOutlineHome } from "react-icons/ai";
// import { TbCircleRectangle } from "react-icons/tb";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { TfiLocationArrow } from "react-icons/tfi";
// import { AiOutlineProject } from "react-icons/ai";
import image from "../assets/Image-32.png";
import { useEffect, useState } from "react";
import DashboardBlackBg from "../Components/dashboard-black-bg";
// import { Link } from "react-router-dom";

interface createData {
  id: number;
  member: string;
  project: number;
  rating: number;
  operation: string;
}
export default function Dashboard() {
  const [data, setData] = useState<createData[]>([]);

  useEffect(() => {
    const Data = async () => {
      try {
        const response = await fetch("http://localhost:8000/circle", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const apiData = await response.json();
        console.log(apiData);
        setData(apiData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    Data();
  }, []);

  return (
    <div className="flex flex-row bg-gray-100">
      <div className=" w-80">
        <DashboardBlackBg image={image} />
      </div>
      {/* table */}
      <div className="flex-1 w-full px-6">
        <div className="w-full grid place-content-center mt-5">
          <input
            placeholder="Search..."
            className="border-2 lg:w-[500px] w-[400px] px-2 py-2 outline-[#F1C644] font-light"
          ></input>
        </div>

        <div className="flex flex-row text-center mt-10 gap-8 w-full justify-between">
          <section className="flex flex-row items-center gap-8">
            <h1 className="text-4xl font-bold">Circles</h1>
            <Button colorScheme="yellow" color="white" className="shadow-sm">
              Add New
            </Button>
          </section>
          <Button colorScheme="yellow" color="white" className="shadow-sm">
            Filter
          </Button>
        </div>

        <div className="mt-4 border-t-2 w-full">
          <TableContainer component={Paper}>
            <Table
              sx={{
                "& tr > *:not(:first-type-of)": {
                  textAlign: "center",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Operation</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.member}</TableCell>
                    <TableCell>{row.project}</TableCell>
                    <TableCell>{row.rating}</TableCell>
                    <TableCell>
                      {row.operation}
                      <button className=" ml-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
