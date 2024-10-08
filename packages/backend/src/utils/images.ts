import type { ContainerProviderConnection, ImageInfo, ListImagesOptions, PullEvent } from '@podman-desktop/api';
import { containerEngine } from '@podman-desktop/api';

/**
 * Given an image name, it will return the ImageInspectInfo corresponding. Will raise an error if not found.
 * @param connection
 * @param image
 * @param callback
 */
export async function getImageInfo(
  connection: ContainerProviderConnection,
  image: string,
  callback: (event: PullEvent) => void,
): Promise<ImageInfo> {
  let imageInfo: ImageInfo | undefined;
  // Get image inspect
  imageInfo = (
    await containerEngine.listImages({
      provider: connection,
    })
  ).find(imageInfo => imageInfo.RepoTags?.some(tag => tag === image));
  if (!imageInfo) {
    try {
      // Pull image
      await containerEngine.pullImage(connection, image, callback);
      // Get image inspect
      imageInfo = (
        await containerEngine.listImages({
          provider: connection,
        } as ListImagesOptions)
      ).find(imageInfo => imageInfo.RepoTags?.some(tag => tag === image));
    } catch (err: unknown) {
      console.warn('Something went wrong while trying to get image inspect', err);
      throw err;
    }
  }

  if (imageInfo === undefined) throw new Error(`image ${image} not found.`);

  return imageInfo;
}
