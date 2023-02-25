import { DirectoryNames } from "./common";

export const UPLOADS_PATH = `${DirectoryNames.Public}/${DirectoryNames.Uploads}/`;
export const DEFAULT_IMAGES_SIZE = 10;

export const enum ImageVariety {
  ProfilePicture = "profile-picture",
  CoverPhoto = "cover-photo",
}
