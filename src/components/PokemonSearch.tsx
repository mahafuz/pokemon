import React, { Component } from "react";
import User from "./../interfaces/User.interface";

interface SearchState {
  error: boolean;
  pokemon: Pokemon;
}

interface Pokemon {
  name: string;
  numberOfAbilites: number;
  baseExperience: number;
  imageUrl: string;
}

class PokemonSearch extends Component<User, SearchState> {
  pokemonRef: React.RefObject<HTMLInputElement>;

  constructor(props: User) {
    super(props);

    this.state = {
      error: false,
      pokemon: null,
    };

    this.pokemonRef = React.createRef();
  }

  onSearchClick = (): void => {
    const inputValue = this.pokemonRef.current.value;
    fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`).then((res) => {
      if (res.status !== 200) {
        this.setState({ error: true });
        return;
      }
      res.json().then((data) => {
        this.setState({
          error: false,
          pokemon: {
            name: data.name,
            numberOfAbilites: data.abilities.length,
            baseExperience: data.base_experience,
            imageUrl: data.sprites.front_default,
          },
        });
      });
    });
  };

  render() {
    const { name: username, numberOfPokemons } = this.props;
    const { error, pokemon } = this.state;

    let resultMarkup;

    if (error) {
      resultMarkup = <p>Pokemon not found, please try again</p>;
    } else if (this.state.pokemon) {
      resultMarkup = (
        <div>
          <img src={pokemon.imageUrl} alt="pokemon" className="pokemon-image" />
          <p>
            {pokemon.name} has {pokemon.numberOfAbilites} abilities and{" "}
            {pokemon.baseExperience} base experience points
          </p>
        </div>
      );
    }

    return (
      <div>
        <p>
          User: {username}{" "}
          {numberOfPokemons && <span>has {numberOfPokemons} pokemons.</span>}
        </p>
        <input type="text" ref={this.pokemonRef} />
        <button className="my-button" onClick={this.onSearchClick}>
          Search
        </button>
        {resultMarkup}
      </div>
    );
  }
}

export default PokemonSearch;
