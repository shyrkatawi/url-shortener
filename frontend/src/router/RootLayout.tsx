import type { LinkProps } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const linkDefaultStyles = "bg-white rounded-sm p-2 text-black";
const activeLinkStyles = " [&.active]:bg-black [&.active]:text-white";
const linkStyles = `${linkDefaultStyles} ${activeLinkStyles}`;

const StyledLink = ({ children, to }: LinkProps) => {
  return (
    <Link to={to} className={linkStyles}>
      {children}
    </Link>
  );
};

export const RootLayout = () => {
  return (
    <>
      <nav className="flex items-center justify-center gap-2 p-2">
        <StyledLink to={"/"}>Create url</StyledLink>
        <StyledLink to={"/delete-url"}>Delete url</StyledLink>
        <StyledLink to={"/url-stats"}>Url stats</StyledLink>
      </nav>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};
