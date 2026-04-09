export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, cursor } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    
    try {
        // coba endpoint marketplace
        const response = await fetch(
            `https://www.roblox.com/marketplace/productinfo?assetId=${userId}`,
            { headers: { "Accept": "application/json" } }
        );
        
        // pakai endpoint yang berbeda
        const response2 = await fetch(
            `https://games.roblox.com/v1/games/game-passes?cursor=${cursor || ""}&limit=30`,
            { headers: { "Accept": "application/json" } }
        );

        // debug - lihat status code
        res.json({
            status1: response.status,
            status2: response2.status,
            text1: await response.text(),
            text2: await response2.text(),
        });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
