import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import Keycloak from 'keycloak-js';
import { getKeycloak } from '../auth/keycloak';

const MainNavbar: React.FC = () => {
    const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

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
                    <p className="font-bold text-xl">Subscription Manager</p>
                </NavbarBrand>
                <div className="flex items-center space-x-8">
                    <NavbarItem>
                        <Link color="foreground" href="/" className="text-lg">
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="/analytics" color="foreground" className="text-lg">
                            Analytics
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Button color="danger" variant="flat" onClick={handleLogout}>
                            Logout
                        </Button>
                    </NavbarItem>
                </div>
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    <p className="font-bold text-inherit text-xl">Subscription Manager</p>
                </NavbarBrand>
            </NavbarContent>

            <NavbarMenu>
                <NavbarMenuItem>
                    <Link color="foreground" href="/" className="text-xl">
                        Home
                    </Link>
                </NavbarMenuItem>
                <NavbarMenuItem>
                    <Link href="/analytics" color="foreground" className="text-xl">
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
