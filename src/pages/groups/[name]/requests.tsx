import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Card, CircularProgress, Typography } from "@material-ui/core";
import { truncate } from "lodash";

import { MEMBER_REUQESTS } from "../../../apollo/client/queries";
import Request from "../../../components/Groups/Request";
import {
  ResourcePaths,
  TruncationSizes,
  TypeNames,
} from "../../../constants/common";
import { GroupSettings, SettingStates } from "../../../constants/setting";
import Messages from "../../../utils/messages";
import {
  useCurrentUser,
  useGroupByName,
  useHasPermissionByGroupId,
  useMembersByGroupId,
  useSettingsByGroupId,
} from "../../../hooks";
import { noCache, settingValue } from "../../../utils/clientIndex";
import { GroupPermissions } from "../../../constants/role";

const Requests = () => {
  const { query } = useRouter();
  const currentUser = useCurrentUser();
  const [group, _setGroup, groupLoading] = useGroupByName(query.name);
  const [groupSettings, _setSettings, groupSettingsLoading] =
    useSettingsByGroupId(group?.id);
  const [groupMembers, _setMembers, groupMembersLoading] = useMembersByGroupId(
    group?.id
  );
  const [memberRequests, setMemberRequests] = useState<ClientMemberRequest[]>(
    []
  );
  const [getMemberRequestsRes, memberRequestsRes] = useLazyQuery(
    MEMBER_REUQESTS,
    noCache
  );
  const [canAcceptMemberRequests] = useHasPermissionByGroupId(
    GroupPermissions.AcceptMemberRequests,
    group?.id
  );

  useEffect(() => {
    if (group) {
      getMemberRequestsRes({
        variables: { groupId: group.id },
      });
    }
  }, [group]);

  useEffect(() => {
    if (memberRequestsRes.data)
      setMemberRequests(memberRequestsRes.data.memberRequests);
  }, [memberRequestsRes.data]);

  const isNoAdmin = (): boolean => {
    return (
      settingValue(GroupSettings.NoAdmin, groupSettings) === SettingStates.On
    );
  };

  const isAMember = (): boolean => {
    const member = groupMembers?.find(
      (member: ClientGroupMember) => member.userId === currentUser?.id
    );
    return Boolean(member);
  };

  const canSeeRequests = (): boolean => {
    if (canAcceptMemberRequests) return true;
    if (isNoAdmin() && isAMember()) return true;
    return false;
  };

  if (
    groupLoading ||
    memberRequestsRes.loading ||
    groupMembersLoading ||
    groupSettingsLoading
  )
    return <CircularProgress />;

  if (!group)
    return <Typography>{Messages.items.notFound(TypeNames.Group)}</Typography>;

  if (canSeeRequests())
    return (
      <>
        <Link href={`${ResourcePaths.Group}${query.name}`}>
          <a>
            <Typography variant="h3" color="primary">
              {truncate(query.name as string, {
                length: TruncationSizes.Medium,
              })}
            </Typography>
          </a>
        </Link>

        <Typography variant="h6" color="primary">
          {Messages.groups.memberRequests(memberRequests.length)}
        </Typography>

        <Card>
          {memberRequests.map((memberRequest: ClientMemberRequest) => {
            return (
              <Request
                memberRequest={memberRequest}
                memberRequests={memberRequests}
                setMemberRequests={setMemberRequests}
                key={memberRequest.userId}
              />
            );
          })}
        </Card>
      </>
    );

  return null;
};

export default Requests;
