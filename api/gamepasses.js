export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, cursor } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    
    try {
        // step 1: fetch semua game milik user
        const gamesRes = await fetch(
            `https://games.roproxy.com/v2/users/${userId}/games?accessFilter=Public&limit=50`,
            { headers: { "Accept": "application/json" } }
        );
        const gamesData = await gamesRes.json();
        
        if (!gamesData.data || gamesData.data.length === 0) {
            return res.json({ passes: [] });
        }

        // step 2: fetch gamepasses per universe
        const passes = [];
        for (const game of gamesData.data) {
            const universeId = game.id;
            try {
                const passRes = await fetch(
                    `https://apis.roproxy.com/game-passes/v1/universes/${universeId}/game-passes?limit=100`,
                    { headers: { "Accept": "application/json" } }
                );
                const passData = await passRes.json();
                
                if (passData.gamePasses) {
                    for (const pass of passData.gamePasses) {
                        if (pass.isForSale) {
                            passes.push({
                                Id: pass.id,
                                Name: pass.displayName || pass.name,
                                GameName: game.name,
                            });
                        }
                    }
                }
            } catch(e) {
                console.error("gamepass fetch error:", e.message);
            }
        }

        res.json({ passes });

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
