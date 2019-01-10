const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateInput(data) {
  let errors = {};

  data.varenummer = !isEmpty(data.varenummer) ? data.varenummer : "";
  data.varenavn = !isEmpty(data.varenavn) ? data.varenavn : "";
  data.pdato = !isEmpty(data.pdato) ? data.pdato : "";
  data.bf = !isEmpty(data.bf) ? data.bf : "";
  data.lokasjon = !isEmpty(data.lokasjon) ? data.lokasjon : "";
  data.vekt = !isEmpty(data.vekt) ? data.vekt : "";

  if (
    !Validator.isLength(data.varenummer, {
      min: 6,
      max: 6
    })
  ) {
    errors.varenummer = "Varenummer må være 6 tall";
  }

  if (!Validator.isNumeric(data.varenummer)) {
    errors.varenummer = "Tallverdi påkrevd";
  }

  if (Validator.isEmpty(data.varenummer)) {
    errors.varenummer = "Varenummer er påkrevd";
  }

  if (Validator.isEmpty(data.varenavn)) {
    errors.varenavn = "Varenavn er påkrevd";
  }

  if (Validator.isEmpty(data.pdato)) {
    errors.pdato = "Produksjon dato er påkrevd";
  }


  if (Validator.isEmpty(data.bf)) {
    errors.bf = "Best før dato er påkrevd";
  }

  if (!Validator.isNumeric(data.lokasjon)) {
    errors.lokasjon = "Tallverdi påkrevd";
  }

  if (
    !Validator.isLength(data.lokasjon, {
      min: 4,
      max: 4
    })
  ) {
    errors.lokasjon = "Lokasjon må være 4 nummer";
  }

  if (Validator.isEmpty(data.lokasjon)) {
    errors.lokasjon = "Lokasjon er påkrevd";
  }

  if (!Validator.isNumeric(data.vekt)) {
    errors.vekt = "Tallverdi påkrevd";
  }

  if (Validator.isEmpty(data.vekt)) {
    errors.vekt = "Vekt er påkrevd";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
