const POKE_API_POKEMON = "https://pokeapi.co/api/v2/pokemon";
const POKE_API_EVOLUTION = "https://pokeapi.co/api/v2/pokemon-species/";
const POKE_API_ABILITIES = "https://pokeapi.co/api/v2/ability/";

const sanitizeName = (pokemon_name) => {
  return pokemon_name
    .trim()
    .toLowerCase()
    .replace(/[^a-z-]/g, "");
};

const getPokemon = async (pokemon_name) => {
  const response = await fetch(`${POKE_API_POKEMON}/${pokemon_name}/`);
  if (!response.ok) alert("No se existe el pokemon con ese nombre");
  return response.json();
};

const getEvolutionChain = async (pokemon_name) => {
  const response = await fetch(`${POKE_API_EVOLUTION}/${pokemon_name}/`);
  const speciesData = await response.json();
  const evolutionEndPoint = speciesData.evolution_chain.url;

  const evolutionResponse = await fetch(evolutionEndPoint);
  const evolutionData = await evolutionResponse.json();

  const evolutions = [];

  const collectEvolutions = (evolution) => {
    evolutions.push({
      name: evolution.species.name,
      is_baby: evolution.is_baby || false,
    });
    evolution.evolves_to.forEach((nextEvolution) => {
      collectEvolutions(nextEvolution);
    });
  };
  collectEvolutions(evolutionData.chain);
  return evolutions;
};

const getAbility = async (ability_name) => {
  const response = await fetch(`${POKE_API_ABILITIES}/${ability_name}/`);
  if (!response.ok) alert("No se existe la habilidad con ese nombre");
  return response.json();
};

const render_Pokemon = (template, pokemon, evolution_chain) => {
  const { id, name, sprites, weight, height, abilities } = pokemon;

  const html = `
    <div class="pokemon-card">
    <div class="pokemon-card_header">
      <h2>${name.charAt(0).toUpperCase() + name.slice(1)} (${id})</h2>
    </div>
    <div class="pokemon-card_body">
      <div class="pokemon-sprites-and-evolutions">
        <h3>Sprites</h3>
        <img src="${sprites.front_default}" alt="${name} front" />
        <img src="${
          sprites.back_default || sprites.front_shiny
        }" alt="${name} back" />
        <h3>Evolution Chain</h3>
        <ul>
          ${evolution_chain
            .map((evolution) => {
              const evolutionName =
                evolution.name.charAt(0).toUpperCase() +
                evolution.name.slice(1);
              return `<li>${evolutionName} ${
                evolution.is_baby ? "(bebé)" : ""
              }</li>`;
            })
            .join("")}
        </ul>
      </div>
      <div class="pokemon-stats-and-abilities">
        <h3>Weight / Height</h3>
        <p>${weight / 10} kg / ${height / 10} m</p>
        <h3 id="header-abilities">Abilities</h3>
        <ul>
          ${abilities
            .map(
              ({ ability, is_hidden }) =>
                `<li>${ability.name} ${is_hidden ? "(oculta)" : ""}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>
  </div>
  `;
  template.innerHTML = html;
};

const render_Ability = (template, ability) => {
  const { name, pokemon } = ability;
  const html = `
  <div class="abilities-card">
    <div class="abilities-card_header">
      <h2>${name.charAt(0).toUpperCase() + name.slice(1)}</h2>
    </div>
    <div class="abilities-card_body">
      <div class="pokemon-learn_it">
        <h3>Who can learn it?</h3>
        <ul>${pokemon
          .map(
            ({ pokemon, is_hidden }) =>
              `<li>${pokemon.name} ${is_hidden ? "(oculta)" : ""}</li>`
          )
          .join("")}</ul>
      </div>
    </div>
  </div>
  `;
  template.innerHTML = html;
};

export { sanitizeName ,getPokemon, getEvolutionChain, getAbility, render_Pokemon, render_Ability };