import React, { useState, useEffect } from 'react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    Link,
    Button,
    Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import Keycloak from 'keycloak-js';
import { getKeycloak } from '../auth/keycloak';
import { useLocation } from 'react-router-dom';

const MainNavbar: React.FC = () => {
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
    const location = useLocation();

    useEffect(() => {
        const kc = getKeycloak();
        setKeycloak(kc);
    }, []);

    const handleLogout = () => {
        if (keycloak) {
            keycloak.logout();
        } else {
            console.error("Keycloak is not initialized.");
        }
    };

    return (
        <Navbar disableAnimation isBordered className="dark text-foreground bg-background">
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle />
            </NavbarContent>

            <NavbarContent className="hidden sm:flex items-center justify-between px-4">
                <NavbarBrand>
                    <p className="font-bold text-2xl">Subscription Manager</p>
                </NavbarBrand>
                <div className="flex items-center space-x-8">
                    <NavbarItem>
                        <Link
                            color="foreground"
                            href="/"
                            className={`text-lg ${location.pathname === "/" ? "text-blue-500" : ""}`}
                        >
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            href="/analytics"
                            color="foreground"
                            className={`text-lg ${location.pathname === "/analytics" ? "text-blue-500" : ""}`}
                        >
                            Analytics
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Dropdown className="dark text-white">
                            <DropdownTrigger>
                                <Avatar
                                    showFallback
                                    src='https://images.unsplash.com/broken'
                                    isBordered
                                    color="success"
                                    size="sm"
                                    radius="md"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions">
                                <DropdownItem color="danger" variant="bordered" onClick={handleLogout}>
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </div>
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <p className="font-bold text-2xl">Subscription Manager</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarMenu>
                <NavbarMenuItem>
                    <Link
                        color="foreground"
                        href="/"
                        className={`text-xl ${location.pathname === "/" ? "text-blue-500" : ""}`}
                    >
                        Home
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link
                        href="/analytics"
                        color="foreground"
                        className={`text-xl ${location.pathname === "/analytics" ? "text-blue-500" : ""}`}
                    >
                        Analytics
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Button color="danger" variant="flat" onClick={handleLogout}>
                        Logout
                    </Button>
                </NavbarMenuItem>
            </NavbarMenu>
        </Navbar>
    );
};

export default MainNavbar;
