import {
  sanitizeName,
  getPokemon,
  getEvolutionChain,
  getAbility,
  render_Pokemon,
  render_Ability,
} from "./pokedex.js";

const htmlElement = {
  formContainer: document.querySelector("form"),
  details_section: document.querySelector("#details"),
  select: document.querySelector("#select-type"),
  clear_button: document.querySelector("#button-reset"),
};

const handlers = {
  submit: async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search_type = htmlElement.select.value;
    const pokemon_name = formData.get("search");
    const sanitized_name = sanitizeName(pokemon_name);

    if (!sanitized_name) {
      alert("El nombre del pokemon no es valido");
      htmlElement.clear_button.style.display = "none";
    }

    if (search_type === "pokemon") {
      const pokemon = await getPokemon(sanitized_name);
      const evolution_Chain = await getEvolutionChain(sanitized_name);
      pokemon.evolution_chain = evolution_Chain;
      render_Pokemon(htmlElement.details_section, pokemon, evolution_Chain);
    } else if (search_type === "ability") {
      const ability = await getAbility(sanitized_name);
      render_Ability(htmlElement.details_section, ability);
    }

    htmlElement.clear_button.style.display = "block";
  },
  clear: () => {
    htmlElement.clear_button.style.display = "none";
    htmlElement.details_section.innerHTML = "";
  },
  onChange: () => {
    htmlElement.clear_button.style.display = "none";
    htmlElement.details_section.innerHTML = "";
  },
};

const bindEvents = () => {
  htmlElement.formContainer.addEventListener("submit", handlers.submit);
  htmlElement.clear_button.addEventListener("click", handlers.clear);
  htmlElement.select.addEventListener("change", handlers.onChange);
};

const init = () => {
  bindEvents();
};

init();
