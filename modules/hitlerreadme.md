# Secret Hitler game implementation for Discord bot

## Variables

These variables are accessible by all the functions and maintain the state of the game.

* `State`: enumeration of states
* `players`: list of players
* `deck`: deck for drawing policies
* `discard`: discard pile
* `sentPolicies`: policies sent to president/chancellor
* `president`: ID of the current president
* `chancellor`: ID of the current chancellor
* `prevPresident`: ID of previous president
* `prevChancellor`: ID of previous chancellor
* `libPoints`: number of liberal policies enacted
* `fasPoints`: number of fascist policies enacted
* `state`: current game state

## Functions

* `newGame`: resets all variables, preparing for a new game
* `addPlayer`: adds a player to the game
  * param `user`: the discord.js `User` object
  * fails if are already 10 players
* `startGame`: prepares a game after all the players are added
  * fails if there are fewer than 5 players
* `assignRoles`: assigns party and role for each player
* `showBoard`: shows current state of the game; each party's policies and the current president
* `sendChancellorCandidates`: generates a list of cancidates for the role of chancellor
* `receiveChancellorCandidates`: receives a number from a player and assigns the role of chancellor
  * param `candidate`: a number indicating the selection of chancellor
* `callForVotes`: asks players to vote Ja oder Nein to the proposed government
* `receiveVote`: receives and processes a player's vote
  * param `vote`: a string containing "Ja" or "Nein"
* `sendPresidentPolicies`: selects three policies from the deck to send to the president
* `receivePresidentPolicies`: receives and processes the president's choice of policies
  * param `policies`: a string containing two policies in the format of 🔵 or 🔴
* `sendChancellorPolicies`: selects two policies from the deck to send to the chancellor
* `receiveChancellorPolicies`: receives and processes the chancellor's choice of policie
  * param `policies`: a string containing 🔵 or 🔴
* `enactPolicy`: enacts the policy sent by the chancellor
* `listPlayers`: lists each player's party and role
* `processCommand`: receives commands from Discord and sends messages; this should be the only function with access to the Discord API

## Game flow

0. `PREPARING`: players can be added
1. `STARTING`: roles are being assigned and cards are being shuffled
2. `PRESIDENT_NOMINATION`: a president is assigned (usually, only follows player sequence)
3. `CHANCELLOR_NOMINATION`: the president must appoint a chancellor
4. `ELECTION`: players must vote Ja or Nein to the proposed government; if `Nein >= p/2`, return to `PRESIDENT_NOMINATION`; if chancellor is Hitler, go to `HEIL_HITLER`
5. `PRESIDENT_POLICIES`: three policies are shown to the president, who must choose one to discard
6. `CHANCELLOR_POLICIES`: two policies are shown to the chancellor, who must choose one to discard
7. `ENACT_POLICY`: the policy is enacted; if no win state is achieved, return to step `PRESIDENT_NOMINATION`
8. `LIBS_WIN`: if `libPoints` = 5, liberals win
9. `FASC_WIN`: if `fasPoints` = 6, fascists win
10. `HEIL_HITLER`: if the chancellor is hitler, fascists win