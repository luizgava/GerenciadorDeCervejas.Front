import http from "../http-common";

class CervejaDataService {
  recuperar(id) {
    return http.get(`/cervejas/${id}`);
  }

  inserir(data) {
    return http.post("/cervejas", data);
  }

  alterar(id, data) {
    return http.put(`/cervejas/${id}`, data);
  }

  remover(id) {
    return http.delete(`/cervejas/${id}`);
  }

  alterarFoto(id, data) {
    return http.put(`/cervejas/${id}/UploadFoto`, data);
  }
}

export default new CervejaDataService();