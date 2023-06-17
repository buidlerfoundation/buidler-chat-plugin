import { useMemo } from "react";
import { useParams } from "next/navigation";

function useChannelId() {
  const params = useParams();
  return useMemo(
    () =>
      params?.channel_id?.toString?.() ||
      "806f7d08-927c-4fe1-9c2f-bd9d442dd9ab",
    [params?.channel_id]
  );
}

export default useChannelId;
