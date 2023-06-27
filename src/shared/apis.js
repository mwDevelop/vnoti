import { api, instance } from "./api";
import axios from "axios";

const apis = {
  postAuth: (data) => api.post("/api/auth/sms/send", data),
  postCheckAuth: (data) => api.post("/api/auth/sms/check", data),
  putMember: (data) => api.put("/api/member", data),
  postLogin: (userData) => api.post("/api/auth/v1/login", userData),
  getUserInfo: (mb_id) => instance.get(`/api/member/${mb_id}`),
  getProfile: (profile_id) => instance.get(`/api/profile/${profile_id}`),
  editUserInfo: (mb_id, chageInfo) =>
    instance.post(`/api/member/${mb_id}`, chageInfo),
  editProfile: (profile_id, chageInfo) =>
    instance.post(`/api/profile/${profile_id}`, chageInfo),

  getSchedule: (schedule_profile_id, schedule_date) =>
    instance.get(
      `/api/schedule?schedule_profile_id=${schedule_profile_id}&schedule_date=${schedule_date}`
    ),

  putMedicine: (data) => instance.put("/api/medicine", data),
  deleteMember: (mb_id) => instance.delete(`/api/member/${mb_id}`),

  editMedicine: (medicine_id, data) =>
    instance.post(`/api/medicine/${medicine_id}`, data),

  getMonthlyCount: (
    schedule_profile_id,
    schedule_start_date,
    schedule_end_date
  ) =>
    instance.get(
      `/api/schedule/monthly/count?schedule_start_date=${schedule_start_date}&schedule_end_date=${schedule_end_date}&schedule_profile_id=${schedule_profile_id}`
    ),
  postSchedule: (schedule_id, data) =>
    instance.post(`/api/schedule/${schedule_id}/confirm`, data),

  getPillList: (medicine_profile_id) =>
    instance.get(`/api/medicine?medicine_profile_id=${medicine_profile_id}`),

  deleteMyPill: (medicine_id) =>
    instance.delete(`/api/medicine/${medicine_id}`),

  putSubScribe: (data) => instance.put("/api/subscribe", data),
  getSubScribe: (subscribe_id) =>
    instance.get(`/api/subscribe/${subscribe_id}`),
  getReceiveSub: (subscribe_id) =>
    instance.get(`/api/subscribe/${subscribe_id}/receive`),
  getShareList: (subscribe_profile_id) =>
    instance.get(`/api/subscribe?subscribe_profile_id=${subscribe_profile_id}`),
  getSubscriptions: () => instance.get("/api/profile/subscribe/list"),
  deleteSubscriptions: (subscribe_id) =>
    instance.delete(`/api/subscribe/${subscribe_id}`),

  postApproval: (scripbe_id, data) =>
    instance.post(`/api/subscribe/${scripbe_id}/approval`, data),

  postAccess: (data) => api.post("/api/auth/kakao/login", data),

  putJournal: (data) => instance.put("/api/journal", data),
  getJournal: (profile_id, day) =>
    instance.get(
      `/api/journal?journal_profile_id=${profile_id}&journal_beg_date=${day}&journal_end_date=${day}`
    ),
  deleteSubscribe: (subscribe_id) =>
    instance.delete(`/api/subscribe/${subscribe_id}`),

  getHistory: (beg, end) =>
    instance.get(`/api/reward?mbp_beg_dt=${beg}& mbp_end_dt=${end}`),
  getHistoryType: (type) => instance.get(`/api/reward?mbp_type=${type}`),
  getAttend: () => instance.get("/api/reward/attend/point"),
  getPoint: () => instance.get("/api/point"),
  getCheckedAttend: () => instance.get("/api/reward/attend/checked"),

  getReward: (type, beg, end, today) =>
    axios.all([
      apis.getHistory(beg, end),
      apis.getCheckedAttend(),
      apis.getHistoryType(type),
      apis.getHistory(today, today),
    ]),
};

export default apis;
