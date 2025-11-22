import api from "./api"


export const FetchUserProfile = async() =>{
      const res = await api.get("/api/profile");
      return res.data;
}

export const UpdateUserProfile = async(data) =>{
      const res = await api.put("/api/profile",data);
      return res.data;
}