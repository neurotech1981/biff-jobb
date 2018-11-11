// /client/App.js
import React, { Component } from "react";
import axios from "axios";
import styles from './styles.css';
import {FormattedDate} from 'react-intl';
import { GoTrashcan } from "react-icons/go";
import { MdModeEdit } from "react-icons/md";
import { MdNoteAdd } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import moment from 'moment';

class App extends Component {
  // initialize our state
  constructor() {
    super();
  this.state = {
    data: [],
    id: 0,  
    varenummer: null,
    varenavn: null,
    pdato: null,
    bf: null,
    lokasjon:null,
    vekt: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };
  this.handleChange = this.handleChange.bind(this);
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

    console.log("response:", this.getDataFromDb);
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  
  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (varenummer, varenavn, pdato, bf, lokasjon, vekt)  => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      varenummer: varenummer,
      varenavn: varenavn,
      pdato: pdato,
      bf: bf,
      lokasjon: lokasjon,
      vekt: vekt
    });
  };

  // our delete method that uses our backend api
  // to remove existing database information
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

  upDateModalForm = (items) => {
    this.setState({varenummer: items.varenummer,varenavn:items.varenavn,pdato:items.pdato,bf:items.bf,lokasjon:items.lokasjon, vekt:items.vekt,id:items._id});  
  }

  updateDB = (idToBeUpdated, varenummer, varenavn, pdato, bf, lokasjon, vekt)  => {
    let currentIds = this.state.data.map(data => data.id);
    while (currentIds.includes(idToBeUpdated)) {
      ++idToBeUpdated;
    }
    axios.post("/api/updateData", {
      id: idToBeUpdated,
      update: { varenummer: varenummer,
      varenavn: varenavn,
      pdato: pdato,
      bf: bf,
      lokasjon: lokasjon,
      vekt: vekt
    }
    });
  };
  // UI Goes here
  render() {
    const { data } = this.state;
    return (
      <div className="jumbotron-kontakt">
      <h1 className="hr.stil1">Legg inn ny vare</h1>
        <div style={{ padding: "20px" }}>
        <div className="input-grid">
          <input
            autoComplete="on"
            type="text"
            maxLength="6"
            onChange={e => this.setState({ varenummer: e.target.value })}
            placeholder="Varenummer"
          />
          <input
            autoComplete="on"
            type="text"
            onChange={e => this.setState({ varenavn: e.target.value })}
            placeholder="Varenavn"
          />
          <input
            type="date"
            onChange={e => this.setState({ pdato: e.target.value })}
            placeholder="(DD/MM/ÅÅÅÅ)"
          />
          <input
            type="date"
            onChange={e => this.setState({ bf: e.target.value })}
            placeholder="(DD/MM/ÅÅÅÅ)"
          />
          <input
            autoComplete="on"
            type="text"
            maxLength="4"
            onChange={e => this.setState({ lokasjon: e.target.value })}
            placeholder="Lokasjon"
          />
          <input
            autoComplete="on"
            type="text"
            maxLength="6"
            onChange={e => this.setState({ vekt: e.target.value })}
            placeholder="Vekt"
          /></div><br></br>
          <button id="button-stor" onClick={() => this.putDataToDB(this.state.varenummer, this.state.varenavn, this.state.pdato, this.state.bf, this.state.lokasjon, this.state.vekt)}>
          <MdNoteAdd/> Legg til
          </button>
        </div>
        <div className="container">
        <div className="modal" id="endreVare">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title">Rediger vare</h1>
        <button type="button" className="close" style={{ width: "40px" }} data-dismiss="modal">&times;</button>
      </div>
      <div className="modal-body">
      <div className="input-grid">
        <p>Varenummer:</p><input
            autoComplete="on"
            type="text"
            maxLength="6"
            id="#endreVare"
            value={this.state.varenummer}
            onChange={e => this.setState({ varenummer: e.target.value })}
          />
          <p>Varenavn:</p><input
            autoComplete="on"
            type="text"
            id="#endreVare"
            value={this.state.varenavn}
            onChange={e => this.setState({ varenavn: e.target.value })}
          />
          <p>Produksjons Dato:</p>
          <input
            type="date"
            id="#endreVare"
            value={moment(this.state.pdato).format("YYYY-MM-DD")}
            onChange={e => this.setState({ pdato: e.target.value })}
          />
          <p>Best før:</p>
          <input
            type="date"
            id="#endreVare"
            value={moment(this.state.bf).format("YYYY-MM-DD")}
            onChange={e => this.setState({ bf: e.target.value })}
          />
          <p>Vekt:</p>
          <input
            style={{ width: "130px" }}
            autoComplete="on"
            type="text"
            maxLength="4"
            id="#endreVare"
            value={this.state.vekt}
            onChange={e => this.setState({ vekt: e.target.value })}
          />
          <button className="btn btn-success" data-toggle="modal" data-target="#endreVare" style={{ width: "60px" }}><MdModeEdit /></button>
          <p>Lokasjon:</p>
          <input
            autoComplete="on"
            type="text"
            maxLength="6"
            value={this.state.lokasjon}
            onChange={e => this.setState({ lokasjon: e.target.value })}
            id="#endreVare"
          /></div><br></br>
          <button id="button-stor" data-dismiss="modal" onClick={() => this.updateDB(this.state.id, this.state.varenummer, this.state.varenavn, this.state.pdato, this.state.bf, this.state.lokasjon, this.state.vekt)}>
            <FaSave/> Lagre
          </button>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-danger" data-dismiss="modal">Lukk</button>
      </div>
    </div>
  </div>
</div>
  <h1 className="hr.stil1">Biff i Reol</h1>
  <p><input style={{ width: "100%" }} id="myInput" type="text" placeholder="Søk etter vare..."></input></p>
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
            ? "NO DB ENTRIES YET"
            : this.state.data.map((item, index) => (
    <tbody id="myTable" key={index}>
      <tr>
        <td>{index}</td>
        <td>{item.varenummer}</td>
        <td>{item.varenavn}</td>
        <td><FormattedDate
                    value={new Date(item.pdato)}
                    day="numeric"
                    month="numeric"
                    year="numeric" /></td>
        <td><FormattedDate
                    value={new Date(item.bf)}
                    day="numeric"
                    month="numeric"
                    year="numeric" /></td>
        <td>{item.vekt} Kg</td>
        <td><b>{item.lokasjon}</b></td>
        <td><div className="col-sm">
                <button className="btn btn-danger" style={{ width: "60px" }} onClick={e => window.confirm("Er du sikker på at du vil slette varen?") && this.deleteFromDB(item.id)}><GoTrashcan /></button></div></td><td>
            <div className="col-sm">
                <button className="btn btn-success" data-toggle="modal" data-target="#endreVare" style={{ width: "60px" }} onClick={(e) => {this.upDateModalForm(item)}}><MdModeEdit /></button></div></td>
      </tr>
      </tbody>
      ))}
  </table>
  <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <li class="page-item disabled">
      <a class="page-link" href="#" tabindex="-1">Previous</a>
    </li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item">
      <a class="page-link" href="#">Next</a>
    </li>
  </ul>
</nav>
</div>
</div>
);
  }
}
export default App;