import { useMemo } from "react";
import { useParams } from "next/navigation";

function useChannelId() {
  const params = useParams();
  return useMemo(() => params.channel_id?.toString?.(), [params.channel_id]);
}

export default useChannelId;
