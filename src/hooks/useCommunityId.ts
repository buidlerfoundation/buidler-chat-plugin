import { useMemo } from "react";
import { useParams } from "next/navigation";

function useCommunityId() {
  const params = useParams();
  return useMemo(
    () =>
      params?.community_id?.toString?.() || "24439d55-3509-4e25-9ff9-362ce2f0a8c2",
    [params?.community_id]
  );
}

export default useCommunityId;
