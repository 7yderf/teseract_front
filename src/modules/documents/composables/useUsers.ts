import { computed, watch } from "vue";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import ApiService from "@/core/services/ApiService";
import { storeToRefs } from "pinia";
import { useUsersStore  } from "../store/StoreUsers";

const getUsers = async (): Promise<any> => {
  const { data } = await ApiService.get("users/list");
  return data;
};

const useUsers = () => {
  const store = useUsersStore();
  const { users } = storeToRefs(store);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })
  watch(error, (newError ) => {
    if (newError) {
      console.error("Error fetching users:", newError);
    }
  });

  watch(data, (newData) => {
    if (newData) {
      const { meta, data } = newData;
      const { users } = data.attributes
      console.log('🚀 ~ useUsers ~ newData:', users)
      store.setUsers(users);
    }
  });

  return {
    users,
    error,
    isLoading,
    isError
  };
};

export default useUsers;