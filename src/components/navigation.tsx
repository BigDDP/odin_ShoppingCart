import { Link, useLocation } from "react-router";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
];

type NavProps = {
  totalCount?: number;
};

const Navigation = ({ totalCount = 0 }: NavProps) => {
  const { pathname } = useLocation();

  const CartPill = () => {
    return (
      <span className="absolute -top-1.5 left-full flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
        {totalCount}
      </span>
    );
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2">
        {links.map(({ to, label }) => (
          <NavigationMenuItem key={to}>
            <NavigationMenuLink
              active={pathname === to}
              className={navigationMenuTriggerStyle()}
              render={<Link to={to} />}
            >
              <span className="relative">
                {label}
                {label === "Cart" && totalCount > 0 ? CartPill() : null}
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
