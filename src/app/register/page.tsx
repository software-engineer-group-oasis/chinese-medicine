"use client"

import RegisterCard from "@/components/RegisterCard";

export default function RegisterPage() {
    return (
        <div style={{
            backgroundImage: `url(/images/login-bg.avif)`,
            height: "120vh",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}>
            <RegisterCard />
        </div>
    )
}