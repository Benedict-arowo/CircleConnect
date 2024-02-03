import Table from "@mui/joy/Table";
import { Button, Center } from "@chakra-ui/react";
import Typography from "@mui/joy/Typography";
import Logo from "../Components/Logo";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineHome } from "react-icons/ai";
import { TbCircleRectangle } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { TfiLocationArrow } from "react-icons/tfi";
import { AiOutlineProject } from "react-icons/ai";
import image from "../assets/Image-32.png";
import { GiPlainCircle } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

function createData(
  Photo: string,
  name: string,
  email: string,
  login: number,
  OPERATION: number
) {
  return { Photo, name, email, login, OPERATION };
}

const rows = [
  //  createData(2, "AltCricle", 6, 4.5, 10),
  //  createData(2, "AltCricle", 6, 4.5, 10),
  //  createData(2, "AltCricle", 6, 4.5, 10),
  //  createData(2, "AltCricle", 6, 4.5, 10),
  //  createData(2, "AltCricle", 6, 4.5, 10),
];

export default function Members() {
  return (
    <div className=" grid grid-cols-4 bg-gray-100">
      <div className=" grid-cols-1">
        <div className=" w-80 bg-neutral-950 h-screen">
          <div className="">
            <Logo type="light" />
            <IoIosArrowBack className="fill-stone-600  w-9 h-9 absolute top-2 left-64" />
          </div>

          <div className="flex flex-col col-span-5 gap-2 mt-40 absolute left-0 ml-5">
            <Button
              color="white"
              variant="link"
              _hover={{ color: "#8B8000" }}
              _active={{ color: "#8B8000" }}
            >
              {<AiOutlineHome />} &nbsp; Home
            </Button>

            <Link to={"/dashboard"}>
              <Button
                color="white"
                variant="link"
                _hover={{ color: "#8B8000" }}
                _active={{ color: "#8B8000" }}
              >
                {<TbCircleRectangle />} &nbsp; Circle
              </Button>
            </Link>

            <Button
              color="white"
              variant="link"
              _hover={{ color: "#8B8000" }}
              _active={{ color: "#8B8000" }}
            >
              {<FaRegCircleUser />} &nbsp; Users
            </Button>

            <Button
              color="white"
              variant="link"
              _hover={{ color: "#8B8000" }}
              _active={{ color: "#8B8000" }}
            >
              {<TfiLocationArrow />} &nbsp; Roles
            </Button>

            <Button
              color="white"
              variant="link"
              _hover={{ color: "#8B8000" }}
              _active={{ color: "#8B8000" }}
            >
              {<AiOutlineProject />} &nbsp; Project
            </Button>
          </div>

          <div className=" absolute bottom-0 flex gap-2 mb-5 ml-5">
            <img src={image} alt={image} className=" object-cover w-10 h-10" />
            {
              <GiPlainCircle className="fill-green-600 relative top-6 right-3" />
            }
            <div>
              <Typography level="h4" component="h2" sx={{ color: "white" }}>
                John Doe
              </Typography>
              <Typography>ADMIN</Typography>
            </div>

            {
              <FaAngleRight className="fill-stone-600 relative left-24 top-2 w-9 h-9" />
            }
          </div>
        </div>
      </div>

      {/* table */}
      <div className=" col-span-3 w-4/5 ml-20 mt-10">
        <div className="  h-10 border-2 absolute right-0 w-2/4 left-1/3 top-2"></div>

        <div className="flex bg-white absolute top-20 h-10 gap-10 items-center rounded-md w-60 shadow-md justify-center">
          <Typography
            level="h4"
            sx={{
              color: "black",
            }}
          >
            Members
          </Typography>
          <Typography
            level="h4"
            sx={{
              color: "gray",
            }}
          >
            Admins
          </Typography>
        </div>

        <div className="flex text-center m-20 gap-8 relative top-10">
          <Typography
            level="h1"
            sx={{
              marginBottom: "40px",
              position: "relative",
              bottom: "10px",
              right: "10px",
            }}
          >
            Members
          </Typography>
          <Button colorScheme="yellow" color="white">
            Add New
          </Button>
          <Button colorScheme="yellow" pos="absolute" right="0" color="white">
            Filter
          </Button>
        </div>

        <div className="relative bottom-20 border-t-2 w-full">
          <Table sx={{ "& tr > *:not(:first-child)": { textAlign: "right" } }}>
            <thead>
              <tr>
                <th>Photo</th>
                <th> Full-Name</th>
                <th>Email</th>
                <th>Last Login</th>
                <th> OPERATION</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.Id}>
                  <td>{row.Id}</td>
                  <td>{row.MEMBER}</td>
                  <td>{row.PROJECT}</td>
                  <td>{row.RATING}</td>
                  <td>{row.OPERATION}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
