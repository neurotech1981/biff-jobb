
/*
Biff oversikt web-applikasjon for lagring av data på ett fryselager.

Med mulighet for å ha paller med flere forskjellige biff varienter i en og samme reol lokasjon.



@Todo:

- Mulighet for varsling når varer holder på og gå ut på dato. (10 dager før Best før dato)
- Fargekoding av forskjellige biff varienter
  * Indrefilet
  * Ytrefilet
  * Entrecôte
  * Mørbrad
  * Flatbiff

*/
import React, { Component } from "react";
import axios from "axios";
import "./styles.css";
import { FormattedDate } from "react-intl";
import { GoTrashcan } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { MdNoteAdd } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FiFileMinus } from "react-icons/fi";
import moment from "moment";
import classnames from "classnames";

class App extends Component {
  // initialize our state
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      id: 0,
      varenummer: '',
      varenavn: '',
      pdato: '',
      bf: '',
      lokasjon: '',
      vekt: '',
      intervalIsSet: false,
      idToDelete: '',
      idToUpdate: '',
      objectToUpdate: '',
      value: '',
      errors: {}
    };
    // Preserve the initial state in a new object
    this.baseState = this.state;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }
  //
  handleSubmit = (e) => {
    e.preventDefault();
    if(this.setState > 0 )
    this.setState(this.baseState);
  }
  //Reset form
  handleClear = (e) => {
    e.preventDefault();
    document.getElementById("myForm").value = "";
    this.setState(this.baseState);
  }
  // Hent inn database innhold med backend API
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }))
      .catch(error => console.error(error));
  };

  // Legg inn ny query / varelinje i database med backend API
  putDataToDB = (e) => {
    e.preventDefault();
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    
    axios
      .post("/api/putData", {
        id: idToBeAdded,
        varenummer: this.state.varenummer,
        varenavn: this.state.varenavn,
        pdato: this.state.pdato,
        bf: this.state.bf,
        lokasjon: this.state.lokasjon,
        vekt: this.state.vekt
      }
      )    
      .catch(err => this.setState({ errors: err.response.data }));
      // clear errors on submit if any present, before correcting old error
      this.setState({errors: ''})
      if(this.setState.length > 0 )
      this.setState(this.baseState);
  }

  // Slette metode for fjerning av varelinje i database med backend API
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  upDateModalForm = items => {
    this.setState({
      varenummer: items.varenummer,
      varenavn: items.varenavn,
      pdato: items.pdato,
      bf: items.bf,
      lokasjon: items.lokasjon,
      vekt: items.vekt,
      id: items._id
    });
  };
  // Rediger varelinje og oppdater database
  updateDB = (
    idToBeUpdated,
    varenummer,
    varenavn,
    pdato,
    bf,
    lokasjon,
    vekt
  ) => {
    let currentIds = this.state.data.map(data => data.id);
    while (currentIds.includes(idToBeUpdated)) {
      ++idToBeUpdated;
    }
    axios.post("/api/updateData", {
      id: idToBeUpdated,
      update: {
        varenummer: varenummer,
        varenavn: varenavn,
        pdato: pdato,
        bf: bf,
        lokasjon: lokasjon,
        vekt: vekt
      }
    });
  };

  // UI
  render() {
    const { errors } = this.state;
    const { data } = this.state;
    return (

      <div className="jumbotron-kontakt">
        <h1>Legg inn ny vare</h1>
        <div className="container">
          <form
            id="myForm"
            className="input-grid"
            onSubmit={this.handleSubmit}
          >
            <span>
              <input
                value={this.state.varenummer}
                type="text"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.varenummer
                })}
                maxLength="6"
                onChange={e => this.setState({ varenummer: e.target.value })}
                placeholder="Varenummer"
              />
              {errors.varenummer && (
                <div className="text-danger">{errors.varenummer}</div>
              )}
              <label>Varenummer:</label>
            </span>

            <span>
              <input
                value={this.state.varenavn}
                type="text"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.varenavn
                })}
                onChange={e => this.setState({ varenavn: e.target.value })}
                placeholder="Varenavn"
              />
              {errors.varenavn && (
                <div className="text-danger">{errors.varenavn}</div>
              )}
              <label>Varenavn:</label>
            </span>
            <span>
              <input
                value={moment(this.state.pdato).format("YYYY-MM-DD")}
                type="date"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.pdato
                })}
                onChange={e => this.setState({ pdato: e.target.value })}
                placeholder="DD-MM-YYYY"
                required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))"
              />
              {errors.pdato && (
                <div className="text-danger">{errors.pdato}</div>
              )}
              <label>Produksjons dato:</label>
            </span>
            <span>
              <input
                value={moment(this.state.bf).format("YYYY-MM-DD")}
                type="date"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.bf
                })}
                onChange={e => this.setState({ bf: e.target.value })}
                placeholder="DD-MM-YYYY"
                required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))"
              />
              {errors.bf && <div className="text-danger">{errors.bf}</div>}
              <label>Best før dato:</label>
            </span>
            <span>
              <input
                value={this.state.lokasjon}
                type="text"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.lokasjon
                })}
                maxLength="4"
                onChange={e => this.setState({ lokasjon: e.target.value })}
                placeholder="Lokasjon"
              />
              {errors.lokasjon && (
                <div className="text-danger">{errors.lokasjon}</div>
              )}
              <label>Lokasjon:</label>
            </span>
            <span>
              <input
                value={this.state.vekt}
                type="text"
                className={classnames("form-control form-control-lg", {
                  "is-invalid": errors.vekt
                })}
                maxLength="6"
                onChange={e => this.setState({ vekt: e.target.value })}
                placeholder="Vekt"
              />
              {errors.vekt && (
                <div className="text-danger">{errors.vekt}</div>
              )}
              
              <label>Vekt:</label>
            </span>

            <br />
            <button
              id="button-stor"
              onClick={this.putDataToDB}
            >
              <MdNoteAdd /> Legg til
            </button>
            <button className="btn btn-link float-left" onClick={this.handleClear}>
              Tøm skjema
            </button>
          </form>
        </div>
         {/* Modal boks for redigering av varelinje */}
        <div className="container">
          <div className="modal" id="endreVare">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title">Rediger vare</h1>
                  <button
                    type="button"
                    className="close"
                    style={{ width: "40px" }}
                    data-dismiss="modal"
                    onClick={this.handleClear}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="input-grid">
                    <span>
                      {" "}
                      <label>Varenummer:</label>
                      <input
                        autoComplete="on"
                        type="text"
                        maxLength="6"
                        id="#endreVare"
                        value={this.state.varenummer}
                        onChange={e =>
                          this.setState({ varenummer: e.target.value })
                        }
                      />
                    </span>
                    <span>
                      <label>Varenavn:</label>
                      <input
                        autoComplete="on"
                        type="text"
                        id="#endreVare"
                        value={this.state.varenavn}
                        onChange={e =>
                          this.setState({ varenavn: e.target.value })
                        }
                      />
                    </span>
                    <span>
                      <label>Produksjons Dato:</label>
                      <input
                        type="date"
                        id="#endreVare"
                        value={moment(this.state.pdato).format("YYYY-MM-DD")}
                        onChange={e => this.setState({ pdato: e.target.value })}
                        placeholder="DD-MM-YYYY"
                        required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))"
                      />
                    </span>
                    <span>
                      <label>Best før dato:</label>
                      <input
                        type="date"
                        id="#endreVare"
                        value={moment(this.state.bf).format("YYYY-MM-DD")}
                        onChange={e => this.setState({ bf: e.target.value })}
                        placeholder="DD-MM-YYYY"
                        required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))"
                      />
                    </span>
                    <span>
                      <label>Vekt:</label>
                      <input
                        style={{ width: "130px" }}
                        autoComplete="on"
                        type="text"
                        maxLength="4"
                        id="#endreVare"
                        value={this.state.vekt}
                        onChange={e => this.setState({ vekt: e.target.value })}
                      />{" "}
                      <button
                        className="btn btn-success"
                        data-toggle="modal"
                        data-target="#endreVare"
                        style={{ height: "60px" }}
                      >
                        <FiFileMinus />
                      </button>
                    </span>
                    <span>
                      <label>Lokasjon:</label>
                      <input
                        autoComplete="on"
                        type="text"
                        maxLength="6"
                        value={this.state.lokasjon}
                        onChange={e =>
                          this.setState({ lokasjon: e.target.value })
                        }
                        id="#endreVare"
                      />
                    </span>
                  </div>
                  <br />
                  <button
                    id="button-stor"
                    data-dismiss="modal"
                    onClick={() =>
                      this.updateDB(
                        this.state.id,
                        this.state.varenummer,
                        this.state.varenavn,
                        this.state.pdato,
                        this.state.bf,
                        this.state.lokasjon,
                        this.state.vekt
                      )
                    }
                  >
                    <FaSave/> Lagre
                  </button>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={this.handleClear}
                  >
                    Lukk
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Slutt **** Modal boks for redigering av varelinje */}
          <h1 className="hr.stil1">Biff i Reol</h1>
          <hr className="stil1" />
          <p>
            <input
              style={{ width: "100%" }}
              id="myInput"
              name="searchBox"
              type="search"
              className="search"
              placeholder="Søk etter vare..."
            />
          </p>
          <table className="table table-light table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="row">ID</th>
                <th scope="row">Varenummer</th>
                <th scope="row">Varenavn</th>
                <th scope="row">Produksjons Dato</th>
                <th scope="row">Best før Dato</th>
                <th scope="row">Vekt</th>
                <th scope="row">Lokasjon</th>
                <th scope="row">Slett</th>
                <th scope="row">Rediger</th>
              </tr>
            </thead>
            {data.length <= 0
              ? data
              : null
              ? "NO DB ENTRIES YET"
              : this.state.data.map((item, index) => (
                  <tbody id="myTable" key={index}>
                    <tr>
                      <td>{index}</td>
                      <td>{item.varenummer}</td>
                      <td>{item.varenavn}</td>
                      <td>
                        <FormattedDate
                          value={new Date(item.pdato)}
                          day="numeric"
                          month="numeric"
                          year="numeric"
                        />
                      </td>
                      <td>
                        <FormattedDate
                          value={new Date(item.bf)}
                          day="numeric"
                          month="numeric"
                          year="numeric"
                        />
                      </td>
                      <td>{item.vekt}kg</td>
                      <td>
                        <b>{item.lokasjon}</b>
                      </td>
                      <td>
                        <div className="col-sm">
                          <button
                            className="btn btn-danger"
                            style={{ width: "60px" }}
                            onClick={e =>
                              window.confirm(
                                "Er du sikker på at du vil slette varen?"
                              ) && this.deleteFromDB(item.id)
                            }
                          >
                            <GoTrashcan />
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className="col-sm">
                          <button
                            className="btn btn-success"
                            data-toggle="modal"
                            data-target="#endreVare"
                            style={{ width: "60px" }}
                            onClick={e => {
                              this.upDateModalForm(item);
                            }}
                          >
                            <MdModeEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
          </table>
        </div>
      </div>
    );
  }
}

export default App;
