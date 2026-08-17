import http from "./http";

const unwrap = (res) => res.data;

export const adminApi = {
  stats: () => http.get("/admin/stats/").then(unwrap),
  settings: () => http.get("/admin/settings/").then(unwrap),
  saveSettings: (data) =>
    http.put("/admin/settings/", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
    }).then(unwrap),
  list: (endpoint) => http.get(endpoint).then(unwrap),
  create: (endpoint, data) => http.post(endpoint, data).then(unwrap),
  update: (endpoint, id, data) => http.patch(`${endpoint}${id}/`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  }).then(unwrap),
  remove: (endpoint, id) => http.delete(`${endpoint}${id}/`).then(unwrap),
};
