import { useEffect, useState } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Home, Group, Menu, EventNote } from "@material-ui/icons";
import { useReactiveVar } from "@apollo/client";

import { NavigationPaths, ResourcePaths } from "../../constants/common";
import { navOpenVar } from "../../apollo/client/localState";
import Messages from "../../utils/messages";
import { scrollTop } from "../../utils/common";

interface NavLinkProps {
  href: string;
  text?: string;
  icon?: React.ReactChild;
}

const NavLink = ({ href, icon, text }: NavLinkProps) => {
  return (
    <Link href={href}>
      <a style={{ color: "inherit" }}>{icon ? icon : text}</a>
    </Link>
  );
};

const BottomNav = () => {
  const [value, setValue] = useState(0);
  const navDrawerOpen = useReactiveVar(navOpenVar);
  const { asPath: currentPath } = useRouter();

  useEffect(() => {
    if (!navDrawerOpen)
      switch (currentPath) {
        case NavigationPaths.Home:
          setValue(0);
          break;
        case getMatching(ResourcePaths.Event):
        case NavigationPaths.Events:
          setValue(1);
          break;
        case getMatching(ResourcePaths.Group):
        case NavigationPaths.Groups:
          setValue(2);
          break;
        default:
          setValue(3);
      }
  }, [currentPath, navDrawerOpen]);

  const getMatching = (path: string): string => {
    const match = currentPath.match(path);
    if (match) return currentPath;
    return "";
  };

  const handleHomeButtonClick = () => {
    if (currentPath === NavigationPaths.Home) scrollTop();
    else Router.push(NavigationPaths.Home);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={(_event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction
        onClick={() => handleHomeButtonClick()}
        icon={<NavLink href={NavigationPaths.Home} icon={<Home />} />}
        label={Messages.navigation.home()}
      />

      <BottomNavigationAction
        onClick={() => Router.push(NavigationPaths.Events)}
        icon={
          <NavLink
            href={NavigationPaths.Events}
            icon={<EventNote style={{ marginBottom: -1 }} />}
          />
        }
        label={Messages.navigation.events()}
      />

      <BottomNavigationAction
        onClick={() => Router.push(NavigationPaths.Groups)}
        icon={<NavLink href={NavigationPaths.Groups} icon={<Group />} />}
        label={Messages.navigation.groups()}
      />

      <BottomNavigationAction
        onClick={() => navOpenVar(true)}
        label={Messages.navigation.menu()}
        icon={<Menu />}
      />
    </BottomNavigation>
  );
};

export default BottomNav;
