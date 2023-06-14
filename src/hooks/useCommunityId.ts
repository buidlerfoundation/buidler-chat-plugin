import { useMemo } from "react";
import { useParams } from "next/navigation";

function useCommunityId() {
  const params = useParams();
  return useMemo(
    () =>
      params?.community_id?.toString?.(),
    [params?.community_id]
  );
}

export default useCommunityId;
