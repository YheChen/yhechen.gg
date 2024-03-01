import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});
  const [additionalPlayerData, setAdditionalPlayerData] = useState({});
  const API_KEY = "RGAPI-71450655-539c-4edc-85c6-2b021fb6b865";

  function searchForPlayer(event) {
    const [searchUsername, searchTagline] = searchText.split("#");
    var APICallString = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${searchUsername}/${searchTagline}?api_key=${API_KEY}`;

    axios
      .get(APICallString)
      .then(function (response) {
        setPlayerData(response.data);

        var puuid = response.data.puuid;
        var APICallString1 = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;

        return axios.get(APICallString1);
      })
      .then(function (response) {
        setAdditionalPlayerData(response.data);
      });
  }

  return (
    <div className="App">
      <div className="container">
        <h5>League Player Finder</h5>
        <input
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
        <button onClick={(e) => searchForPlayer(e)}>Search for Player</button>
      </div>
      {JSON.stringify(additionalPlayerData) !== "{}" ? (
        <>
          <p>
            {additionalPlayerData.gameName} + {additionalPlayerData.tagLine}
          </p>
          <p>Summoner Level {additionalPlayerData.summonerLevel}</p>
        </>
      ) : (
        <>
          <p>No Player Data</p>
        </>
      )}
    </div>
  );
}

export default App;
