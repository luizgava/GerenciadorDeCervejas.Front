import React, { Component } from "react";
import CervejaDataService from "../services/cerveja.service";

export default class VisualizarCerveja extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cerveja: {
      }
    };
    this.onAlterar = this.onAlterar.bind(this);
    this.onAlterarFoto = this.onAlterarFoto.bind(this);
    this.onRemover = this.onRemover.bind(this);
  }

  componentDidMount() {
    CervejaDataService.recuperar(this.props.match.params.id)
      .then(response => {
        this.setState({ cerveja: response.data });
      })
      .catch(e => {
        alert(e.response.data.value);
      });
  }

  async onAlterar() {
    const { cerveja } = this.state;
    await this.props.history.push('/editar/' + cerveja.Id);
  }

  async onAlterarFoto() {
    const { cerveja } = this.state;
    await this.props.history.push('/foto/' + cerveja.Id);
  }

  async onRemover() {
    const { cerveja } = this.state;
    if (!window.confirm('Deseja realmente remover essa cerveja?')) {
      return;
    }
    CervejaDataService.remover(cerveja.Id)
      .then(async response => {
        await this.props.history.push('/');
      })
      .catch(e => {
        alert(e.response.data.value);
      });
  }

  render() {
    const { cerveja } = this.state;

    return (
      <div className="detalhes-cerveja">
        <div className="coluna-esquerda">
          {cerveja.Id && <img className="cerveja-foto" src={process.env.REACT_APP_API_URL + "/Cervejas/" + cerveja.Id + "/Foto?d=" + cerveja.DataAlteracao.toString()} alt="" />}
        </div>
        <div className="coluna-direita">
          <div className="cerveja-nome">
            <h1>{cerveja.Nome}</h1>
            <p>{cerveja.Descricao}</p>
          </div>
          <div className="cerveja-harmonizacao">
            <span>DICAS DE HARMONIZAÇÃO</span>
            <p>{cerveja.Harmonizacao}</p>
          </div>
          <div className="cerveja-cor">
            <span>COR</span>
            <p>{cerveja.Cor}</p>
          </div>
          <div className="cerveja-teoralcoolico">
            <span>TEOR ALCOÓLICO</span>
            <p>{cerveja.TeorAlcoolico}</p>
          </div>
          <div className="cerveja-temperatura">
            <span>TEMPERATURA</span>
            <p>{cerveja.Temperatura}</p>
          </div>
          <div className="cerveja-ingredientes">
            <span>Ingredientes</span>
            <p>{cerveja.Ingredientes}</p>
          </div>
          <div className="cerveja-opcoes">
            <button className="btn btn-secondary" onClick={this.onAlterar}>
              Alterar
          </button>
            <button className="btn btn-secondary" onClick={this.onAlterarFoto}>
              Alterar foto
          </button>
            <button className="btn btn-danger" onClick={this.onRemover}>
              Remover
          </button>
          </div>
        </div>
      </div>
    );
  }
}