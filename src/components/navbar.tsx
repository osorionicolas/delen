"use client"
import React from "react"
import { HomeIcon, SettingsIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

const Navbar = () => {

    return (
        <header className="text-white shadow-sm">
            <div className="flex bg-[#009980] min-h-12 items-center px-6">
                <div className="flex justify-around">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <HomeIcon className="h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                    <Link href="/settings">
                        <Button variant="ghost" className="gap-2">
                            <SettingsIcon className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Navbar

