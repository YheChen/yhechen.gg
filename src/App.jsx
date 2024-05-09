import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import CHALLENGER from "./images/CHALLENGER.png";
import GRANDMASTER from "./images/GRANDMASTER.png";
import MASTER from "./images/MASTER.png";
import DIAMOND from "./images/DIAMOND.png";
import EMERALD from "./images/EMERALD.png";
import PLATINUM from "./images/PLATINUM.png";
import GOLD from "./images/GOLD.png";
import SILVER from "./images/SILVER.png";
import BRONZE from "./images/BRONZE.png";
import IRON from "./images/IRON.png";

function App() {
  const [searchUsername, setSearchUsername] = useState("");
  const [searchTagline, setSearchTagline] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [playerLVL, setPlayerLVL] = useState(null);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false); // Only display info if the button is pressed
  const [playerRankData, setPlayerRankData] = useState(null); // League-v4
  const [playerRank, setPlayerRank] = useState(null); // Rank is I, II, III, IV
  const [playerRankTier, setPlayerRankTier] = useState(null); // Tier is Diamond, Master, Gold etc
  const [playerLP, setPlayerLP] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [playerLosses, setPlayerLosses] = useState(0);
  const [playerWinRate, setPlayerWinRate] = useState(null);
  const API_KEY = "RGAPI-ec025171-908f-40bc-b3fb-e48936aff41e";

  function searchForPlayer(event) {
    event.preventDefault();
    const riotAPICallString = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${searchUsername}/${searchTagline}?api_key=${API_KEY}`;
    axios.get(riotAPICallString).then(function (response) {
      const playerPUUID = response.data.puuid;
      const lolAPICallString = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${playerPUUID}?api_key=${API_KEY}`;
      var playerSummonerID = null;
      axios.get(lolAPICallString).then(function (response) {
        setPlayerData(response.data);
        setPlayerLVL(response.data.summonerLevel);
        setShowPlayerInfo(true);
        var playerSummonerID = response.data.id;
        const leagueV4CallString = `https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${playerSummonerID}?api_key=${API_KEY}`;
        axios.get(leagueV4CallString).then(function (response) {
          setPlayerRankData(response.data);
          const firstEntry = response.data[0];
          if (response.data.length > 0) {
            setPlayerRank(firstEntry.rank);
            setPlayerRankTier(firstEntry.tier);
            setPlayerLP(firstEntry.leaguePoints);
            setPlayerWins(firstEntry.wins);
            setPlayerLosses(firstEntry.losses);
            const winRate = Math.round(
              (100 * firstEntry.wins) / (firstEntry.wins + firstEntry.losses)
            );
            setPlayerWinRate(winRate + "%");
          }
        });
      });
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h5>League Player Finder</h5>
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Username"
        ></input>
        <input
          type="text"
          value={searchTagline}
          onChange={(e) => setSearchTagline(e.target.value)}
          placeholder="Tagline"
        ></input>
        <button onClick={(e) => searchForPlayer(e)}>Search for Player</button>
      </div>
      {showPlayerInfo && playerData && (
        <>
          <div>
            <p>
              {searchUsername}#{searchTagline}
            </p>
            <img
              width="125"
              height="125"
              src={`https://ddragon.leagueoflegends.com/cdn/14.9.1/img/profileicon/${playerData.profileIconId}.png`}
              alt="Summoner Icon"
            />
          </div>
          <img
            width="125"
            height="125"
            src={
              playerRankTier === "CHALLENGER"
                ? CHALLENGER
                : playerRankTier === "GRANDMASTER"
                ? GRANDMASTER
                : playerRankTier === "MASTER"
                ? MASTER
                : playerRankTier === "DIAMOND"
                ? DIAMOND
                : playerRankTier === "EMERALD"
                ? EMERALD
                : playerRankTier === "PLATINUM"
                ? PLATINUM
                : playerRankTier === "GOLD"
                ? GOLD
                : playerRankTier === "SILVER"
                ? SILVER
                : playerRankTier === "BRONZE"
                ? BRONZE
                : playerRankTier === "IRON"
                ? IRON
                : null
            }
            alt="Unranked"
          />
          <p>Summoner Level {playerLVL}</p>
          <p>
            {playerRankTier} {playerRank} • {playerLP} LP
          </p>
          <p>
            {playerWins} W - {playerLosses} L
          </p>
          <p>{playerWinRate} Winrate</p>
        </>
      )}
    </div>
  );
}

export default App;
