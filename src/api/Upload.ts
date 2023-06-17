import { BaseDataApi, FileApiData } from "models";
import Caller from "./Caller";
import { toast } from "react-hot-toast";
import AppConfig from "common/AppConfig";

const UploadAPI = {
  uploadFile: (
    teamId?: string,
    attachmentId?: string,
    file?: File,
    messageEntityType?: string,
    fileId?: string
  ): Promise<BaseDataApi<FileApiData>> => {
    if (!file) {
      return Promise.resolve({ success: false, statusCode: 400 });
    }
    if (file?.size > AppConfig.maximumFileSize) {
      toast.error("Your file upload is too large. Maximum file size 100 MB.");
      return Promise.resolve({ success: false, statusCode: 400 });
    }
    const data = new FormData();
    if (teamId) {
      data.append("team_id", teamId);
    }
    if (attachmentId) {
      data.append("attachment_id", attachmentId);
    }
    if (messageEntityType) {
      data.append("message_entity_type", messageEntityType);
    }
    if (fileId) {
      data.append("file_id", fileId);
    }
    data.append("file", file);
    return Caller.post<FileApiData>(`file`, data);
  },
  removeFile: (fileId: string) => Caller.delete(`file/${fileId}`),
};

export default UploadAPI;
