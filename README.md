# YucataPlayLoggerForBGG - Yucata play auto-logging dialog for BGG

This dialog is based on [SPLU](https://github.com/dazeysan/SPLU). Find out about SPLU in the [SPLU BGG Guild](https://www.boardgamegeek.com/guild/3403).

Currently the BGG user id is directly maintained in the code in `Source Code/SPLU-Current.js` in the following line:
`xhr.open("GET", "https://www.boardgamegeek.com/xmlapi2/plays?username=stonetest12&page=" + iPage);`
This needs to be adjusted to read the correct plays already logged at BGG!
