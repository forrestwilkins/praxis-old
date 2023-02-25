// TODO: Add ability to select multiple hosts for event

import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import Router from "next/router";
import {
  createStyles,
  withStyles,
  Button,
  Divider,
  FormGroup,
  Typography,
  CardActions as MUICardActions,
  FormControl,
  InputLabel,
  MenuItem,
  LinearProgress,
} from "@material-ui/core";
import { Add, Remove, RemoveCircle } from "@material-ui/icons";
import { Formik, Form, Field, FormikProps } from "formik";
import { Switch } from "formik-material-ui";
import dayjs, { Dayjs } from "dayjs";

import { CREATE_EVENT, UPDATE_EVENT } from "../../apollo/client/mutations";
import styles from "../../styles/Event/Form.module.scss";
import Messages from "../../utils/messages";
import {
  nowRoundedToNextHour,
  generateRandom,
  errorToast,
} from "../../utils/clientIndex";
import { useCurrentUser, useMembersByGroupId } from "../../hooks";
import SubmitButton from "../Shared/SubmitButton";
import TextField from "../Shared/TextField";
import { ResourcePaths } from "../../constants/common";
import ImageInput from "../Images/Input";
import { EventFieldNames } from "../../constants/event";
import DateTimePicker from "../Shared/DateTimePicker";
import { BLURPLE } from "../../styles/Shared/theme";
import CancelButton from "../Shared/CancelButton";
import Dropdown from "../Shared/Dropdown";
import UserName from "../Users/Name";

const CardActions = withStyles(() =>
  createStyles({
    root: {
      justifyContent: "space-between",
      padding: 0,
    },
  })
)(MUICardActions);

const TextButton = withStyles(() =>
  createStyles({
    root: {
      textTransform: "none",
      color: BLURPLE,
      padding: 0,
      marginTop: 12,
      borderRadius: 4,
      width: "17ch",
    },
  })
)(Button);

interface Props {
  event?: ClientEvent;
  groupId?: string;
  isEditing?: boolean;
  closeModal?: () => void;
  submitButtonText?: string;
  onSubmit?: (groupEvent: EventMotionInput) => void;
  onCancel?: () => void;
  inMotionForm?: boolean;
}

const EventForm = ({
  event,
  groupId,
  isEditing,
  closeModal,
  submitButtonText,
  onSubmit,
  onCancel,
  inMotionForm,
}: Props) => {
  const currentUser = useCurrentUser();
  const [startsAt, setStartsAt] = useState(nowRoundedToNextHour().toString());
  const [endsAt, setEndsAt] = useState(nowRoundedToNextHour().toString());
  const [coverPhoto, setCoverPhoto] = useState<File>();
  const [imageInputKey, setImageInputKey] = useState("");
  const [showEndsAt, setShowEndsAt] = useState(false);
  const [groupMembers, _, groupMembersLoading] = useMembersByGroupId(
    inMotionForm && groupId
  );
  const [hosts, setHosts] = useState<SelectedUser[]>([]);
  const [createEvent] = useMutation(CREATE_EVENT);
  const [updateEvent] = useMutation(UPDATE_EVENT);
  const submitText = submitButtonText
    ? submitButtonText
    : isEditing
    ? Messages.actions.save()
    : Messages.actions.create();

  const initialValues: EventFormValues =
    isEditing && event
      ? {
          name: event.name,
          description: event.description,
          location: event.location || "",
          externalLink: event.externalLink || "",
          online: event.online,
        }
      : {
          name: "",
          description: "",
          location: "",
          externalLink: "",
          online: false,
        };

  useEffect(() => {
    if (event && isEditing) {
      setStartsAt(dayjs(parseInt(event.startsAt)).toString());
      setEndsAt(dayjs(parseInt(event.endsAt)).toString());
      if (event.endsAt) setShowEndsAt(true);
    }
  }, [event, isEditing]);

  useEffect(() => {
    if (showEndsAt && !isEditing) setEndsAt(startsAt);
  }, [startsAt, showEndsAt, isEditing]);

  const handleSubmit = async (formValues: EventFormValues) => {
    const commonVars = {
      ...(showEndsAt && { endsAt }),
      ...formValues,
      coverPhoto,
      startsAt,
    };
    if (onSubmit && groupId)
      onSubmit({
        ...commonVars,
        groupId,
        hosts,
      });
    else {
      try {
        if (isEditing && event) {
          const { data } = await updateEvent({
            variables: {
              id: event.id,
              ...commonVars,
            },
          });

          Router.push(`${ResourcePaths.Event}${data.updateEvent.event.id}`);
        } else {
          const { data } = await createEvent({
            variables: {
              userId: currentUser?.id,
              ...commonVars,
              groupId,
            },
          });

          if (closeModal) closeModal();
          Router.push(`${ResourcePaths.Event}${data.createEvent.event.id}`);
        }
      } catch (err) {
        errorToast(err);
      }
    }
  };

  const handleStartsAtChange = (value: Dayjs | null) =>
    setStartsAt((value as Dayjs).toString());

  const handleEndsAtChange = (value: Dayjs | null) =>
    setEndsAt((value as Dayjs).toString());

  const handleHostChange = (event: React.ChangeEvent<{ value: unknown }>) =>
    setHosts([{ userId: event.target.value as string }]);

  const removeSelectedCoverPhoto = () => {
    setCoverPhoto(undefined);
    setImageInputKey(generateRandom());
  };

  const isSubmitButtonDisabled = ({
    values: { name, description },
    isSubmitting,
    dirty,
  }: FormikProps<EventFormValues>): boolean => {
    if (isSubmitting) return true;
    if (!name || !description) return true;
    if (isEditing) return false;
    return !dirty;
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formik) => (
        <Form>
          <FormGroup>
            <Field
              name={EventFieldNames.Name}
              label={Messages.events.form.name()}
              component={TextField}
              autoComplete="off"
            />

            <Field
              name={EventFieldNames.Description}
              label={Messages.events.form.description()}
              component={TextField}
              multiline
            />

            <DateTimePicker
              value={startsAt}
              onChange={handleStartsAtChange}
              label={Messages.events.form.startsAt()}
              style={{ marginTop: 24 }}
              disablePast
            />

            {showEndsAt ? (
              <>
                <DateTimePicker
                  value={endsAt}
                  onChange={handleEndsAtChange}
                  label={Messages.events.form.endsAt()}
                  minDate={startsAt}
                  disablePast
                  style={{ marginTop: 36 }}
                />

                <TextButton onClick={() => setShowEndsAt(false)}>
                  <Remove fontSize="small" /> {Messages.events.form.endsAt()}
                </TextButton>
              </>
            ) : (
              <TextButton onClick={() => setShowEndsAt(true)}>
                <Add fontSize="small" /> {Messages.events.form.endsAt()}
              </TextButton>
            )}

            <Field
              name={EventFieldNames.Location}
              label={Messages.events.form.location()}
              placeholder={Messages.events.form.includeAddress()}
              component={TextField}
              multiline
            />

            {inMotionForm && (
              <>
                {groupMembersLoading ? (
                  <LinearProgress />
                ) : (
                  <FormControl style={{ marginBottom: 18 }}>
                    <InputLabel>{Messages.events.form.chooseHost()}</InputLabel>
                    <Dropdown
                      value={hosts[0]?.userId || ""}
                      onChange={handleHostChange}
                    >
                      {groupMembers.map((member) => (
                        <MenuItem value={member.userId} key={member.id}>
                          <UserName userId={member.userId} />
                        </MenuItem>
                      ))}
                    </Dropdown>
                  </FormControl>
                )}
              </>
            )}

            {formik.values.online && (
              <Field
                name={EventFieldNames.ExternalLink}
                label={Messages.events.form.externalLink()}
                placeholder={Messages.events.form.http()}
                component={TextField}
              />
            )}

            <div className={styles.onlineField}>
              <div>
                <Typography>{Messages.events.online.online()}</Typography>
                <div className={styles.onlineFieldSubtext}>
                  {Messages.events.form.onlineSubtext()}
                </div>
              </div>
              <Field
                name={EventFieldNames.Online}
                component={Switch}
                type="checkbox"
              />
            </div>
          </FormGroup>

          <Divider style={{ marginBottom: 18 }} />

          {coverPhoto && (
            <>
              <div className={styles.selectedImages}>
                <img
                  alt={Messages.images.couldNotRender()}
                  className={styles.selectedImage}
                  src={URL.createObjectURL(coverPhoto)}
                />

                <RemoveCircle
                  color="primary"
                  onClick={() => removeSelectedCoverPhoto()}
                  className={styles.removeSelectedImageButton}
                />
              </div>

              <Divider style={{ marginBottom: 12, marginTop: 18 }} />
            </>
          )}

          <CardActions>
            <ImageInput
              setImage={setCoverPhoto}
              refreshKey={imageInputKey}
              style={{ marginTop: -12 }}
            />

            <div className={styles.flexEnd}>
              {onCancel && (
                <CancelButton onClick={onCancel} style={{ marginRight: 12 }} />
              )}

              <SubmitButton disabled={isSubmitButtonDisabled(formik)}>
                {submitText}
              </SubmitButton>
            </div>
          </CardActions>
        </Form>
      )}
    </Formik>
  );
};

export default EventForm;
