import { CSSProperties } from "react";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client";
import {
  List,
  ListItem as MUIListItem,
  withStyles,
  createStyles,
  ListItemIcon,
  ListItemText as MUIListItemText,
  makeStyles,
} from "@material-ui/core";
import {
  Home as HomeIcon,
  Link as InvitesIcon,
  Group as GroupsIcon,
  AccountBox as RolesIcon,
  EventNote as EventsIcon,
  SupervisedUserCircle as UsersIcon,
} from "@material-ui/icons";

import { navKeyVar } from "../../apollo/client/localState";
import { NavigationPaths } from "../../constants/common";
import { WHITE } from "../../styles/Shared/theme";
import Messages from "../../utils/messages";
import { useCurrentUser, useHasPermissionGlobally } from "../../hooks";
import { GlobalPermissions } from "../../constants/role";
import styles from "../../styles/Navigation/LeftNav.module.scss";
import { useRouter } from "next/router";
import MotionButton from "../Motions/MotionButton";

const ListItem = withStyles(() =>
  createStyles({
    root: {
      borderRadius: 9999,
    },
  })
)(MUIListItem);

const ListItemText = withStyles(() =>
  createStyles({
    primary: {
      color: WHITE,
      fontSize: 20,
    },
  })
)(MUIListItemText);

const useStyles = makeStyles({
  bold: {
    fontFamily: "Inter Bold",
  },
});

const LeftNav = () => {
  const currentUser = useCurrentUser();
  const refreshKey = useReactiveVar(navKeyVar);
  const [canManageRoles] = useHasPermissionGlobally(
    GlobalPermissions.ManageRoles,
    refreshKey
  );
  const [canManageUsers] = useHasPermissionGlobally(
    GlobalPermissions.ManageUsers,
    refreshKey
  );
  const [canManageInvites] = useHasPermissionGlobally(
    GlobalPermissions.ManageInvites,
    refreshKey
  );
  const [canCreateInvites] = useHasPermissionGlobally(
    GlobalPermissions.CreateInvites,
    refreshKey
  );
  const { asPath: currentPath } = useRouter();
  const classes = useStyles();

  const makeBold = (path: NavigationPaths): { primary: string } => {
    return {
      primary: currentPath === path ? classes.bold : "",
    };
  };

  const makeLarge = (path: NavigationPaths): CSSProperties => {
    const transition: CSSProperties = { transition: "0.2s ease" };
    if (currentPath === path)
      return { fontSize: 28, marginLeft: -2, ...transition };
    return transition;
  };

  return (
    <div className={styles.leftNav}>
      <List>
        <Link href={NavigationPaths.Home}>
          <a>
            <ListItem button>
              <ListItemIcon>
                <HomeIcon
                  color="primary"
                  style={makeLarge(NavigationPaths.Home)}
                />
              </ListItemIcon>
              <ListItemText
                primary={Messages.navigation.home()}
                classes={makeBold(NavigationPaths.Home)}
              />
            </ListItem>
          </a>
        </Link>

        <Link href={NavigationPaths.Groups}>
          <a>
            <ListItem button>
              <ListItemIcon>
                <GroupsIcon
                  style={makeLarge(NavigationPaths.Groups)}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemText
                primary={Messages.navigation.groups()}
                classes={makeBold(NavigationPaths.Groups)}
              />
            </ListItem>
          </a>
        </Link>

        <Link href={NavigationPaths.Events}>
          <a>
            <ListItem button>
              <ListItemIcon>
                <EventsIcon
                  style={makeLarge(NavigationPaths.Events)}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemText
                primary={Messages.navigation.events()}
                classes={makeBold(NavigationPaths.Events)}
              />
            </ListItem>
          </a>
        </Link>

        {canManageRoles && (
          <Link href={NavigationPaths.Roles}>
            <a>
              <ListItem button>
                <ListItemIcon>
                  <RolesIcon
                    style={makeLarge(NavigationPaths.Roles)}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={Messages.navigation.roles()}
                  classes={makeBold(NavigationPaths.Roles)}
                />
              </ListItem>
            </a>
          </Link>
        )}

        {canManageUsers && (
          <Link href={NavigationPaths.Users}>
            <a>
              <ListItem button>
                <ListItemIcon>
                  <UsersIcon
                    style={makeLarge(NavigationPaths.Users)}
                    color="primary"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={Messages.navigation.users()}
                  classes={makeBold(NavigationPaths.Users)}
                />
              </ListItem>
            </a>
          </Link>
        )}

        {(canManageInvites || canCreateInvites) && (
          <Link href={NavigationPaths.Invites}>
            <a>
              <ListItem button>
                <ListItemIcon>
                  <InvitesIcon
                    color="primary"
                    style={makeLarge(NavigationPaths.Invites)}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={Messages.navigation.invites()}
                  classes={makeBold(NavigationPaths.Invites)}
                />
              </ListItem>
            </a>
          </Link>
        )}
      </List>

      {currentUser && <MotionButton />}
    </div>
  );
};

export default LeftNav;
