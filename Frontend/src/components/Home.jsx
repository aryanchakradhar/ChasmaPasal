import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"


const Home = () => {
  const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  useEffect(() => {
    if(UserInfo.role === "doctor") {
      navigate('/user');
    }
  }, []);
  return (
    <div className="container flex justify-evenly mt-7 flex-wrap">
      <div>
      <Card className="h-[50rem] w-[40rem] flex items-center justify-center flex-col space-y-2 shadow-lg bg-mainbg">
        <h1 className="text-[4rem] leading-tight">Let's</h1>
        <h1 className="text-[5rem] leading-tight tracking-wide">Check</h1>
        <h1 className="text-[8rem] leading-tight tracking-wide">our</h1>
        <h1 className="text-[8rem] leading-tight tracking-wide">Vision</h1>
        <Link to='/appointments' className="underline leading-tight tracking-wide">BOOK NOW</Link>
      </Card>
      </div>
    </div>

  )
}

export default Home