import Link from "next/link";
import { useRouter } from "next/router";

import { ResourcePaths } from "../../constants/common";
import { baseUrl } from "../../utils/clientIndex";
import Messages from "../../utils/messages";

interface Props {
  images: ClientImage[];
}

const List = ({ images }: Props) => {
  const router = useRouter();

  const imgLinkPath = (image: ClientImage): string => {
    if (image.postId) return `${ResourcePaths.Post}${image.postId}`;
    if (image.motionId) return `${ResourcePaths.Motion}${image.motionId}`;
    return router.asPath;
  };

  return (
    <>
      {images
        .slice()
        .reverse()
        .map((image) => {
          return (
            <Link href={imgLinkPath(image)} key={image.id}>
              <a>
                <img
                  src={baseUrl + image.path}
                  alt={Messages.images.couldNotRender()}
                  style={{
                    width: "100%",
                    display: "block",
                  }}
                />
              </a>
            </Link>
          );
        })}
    </>
  );
};

export default List;
