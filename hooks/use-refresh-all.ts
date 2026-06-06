import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useRefreshAll = () => {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  };

  return { refreshing, onRefresh };
};
