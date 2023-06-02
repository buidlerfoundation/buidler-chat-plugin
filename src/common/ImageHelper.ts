import CryptoJS from "crypto-js";

type imageOptions = {
  w?: number;
  h?: number;
  radius?: number;
  fm?: string;
};

class ImageHelper {
  imgBucket?: string = "";
  imgDomain?: string = "";

  initial(domain?: string, bucket?: string) {
    this.imgBucket = bucket;
    this.imgDomain = domain;
  }

  buildImagePath = (
    name?: string,
    id?: string,
    options?: string,
    noParams = false
  ) => {
    const suffix = `plain/gs://${this.imgBucket}`;
    if (!name && id?.substring(0, 2) === "0x") {
      return `${suffix}/${id}/ethereum_blockies.png`;
    }
    if (name?.includes?.(".gif") || noParams) {
      return `${suffix}/${id}/${name}`;
    }
    let params = "";
    if (options) {
      params += `${options}/`;
    }
    return `${params}${suffix}/${id}/${name}`;
  };

  isVideo = (name?: string) => {
    if (!name) return false;
    return /.{0,}(\.mp4|\.mov|\.avi|\.m4v|\.m4p)$/g.test(name);
  };

  shouldUseOrigin = (name?: string) => {
    if (!name) return false;
    return !/.{0,}(\.jpeg|\.png|\.gif|\.jpg|\.JPG)$/g.test(name);
  };

  normalizeImage = (
    name?: string,
    id?: string,
    options?: string,
    noParams = false
  ) => {
    if (!this.imgDomain || !this.imgBucket) return "";
    if (name && (name?.includes("https://") || name?.includes("http://")))
      return name;
    if (this.shouldUseOrigin(name)) {
      return `https://storage.googleapis.com/${this.imgBucket}/${id}/${name}`;
    }
    const domain = this.imgDomain;
    const path = this.buildImagePath(name, id, options, noParams);
    const message = `${process.env.NEXT_PUBLIC_IMAGE_SALT}/${path}`;
    const key = `${process.env.NEXT_PUBLIC_IMAGE_KEY}`;
    const signature = CryptoJS.HmacSHA256(message, key)
      .toString(CryptoJS.enc.Base64)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    const url = `${domain}/${signature}/${path}`;
    return url;
  };
}

export default new ImageHelper();
