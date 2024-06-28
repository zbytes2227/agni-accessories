
"use client"
import auth from "@/pages/api/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [Dashboard, setDashboard] = useState('');
  const [msg, setmsg] = useState("")
  useEffect(() => {
    
    auth();

    fetch("/api/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          setDashboard(data);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [])

  const router = useRouter();
  async function auth() {
    const fetch_api = await fetch("/api/auth/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetch_api.json();
    if (!data.success) {
      router.push("/login");
    }
  }

  
  return (
    <>
      <div class="mx-auto container mt-20 text-center">
          <img
          className={` top-0 left-0 w-full h-full object-cover `}
          src="/pex.jpg"
        ></img>
             <img
          className={`mt-3 top-0 left-0 w-full h-full object-cover `}
          src="/lex.jpg"
        ></img>
      </div>
      <a href="/admin/orders/add" class="block text-white bg-green-700 hover:bg-red-800 font-semibold rounded-lg text-md px-8 py-2.5 text-center m-2" type="button">Create New Order </a>
    </>
  );
}
