export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const { userId, cursor } = req.query;
    
    if (!userId) {
        return res.status(400).json({ error: "userId required" });
    }
    
    try {
        const listRes = await fetch(
            `https://catalog.roblox.com/v1/search/items?category=GamePass&creatorType=User&creatorTargetId=${userId}&limit=30&cursor=${cursor || ""}`,
            { headers: { "Accept": "application/json" } }
        );
        const listData = await listRes.json();
        
        if (!listData.data || listData.data.length === 0) {
            return res.json({ passes: [] });
        }

        // fetch detail per item satu per satu pakai economy API
        const passes = [];
        for (const item of listData.data) {
            try {
                const detailRes = await fetch(
                    `https://economy.roblox.com/v2/game-passes/${item.id}/game-pass-product-info`,
                    { headers: { "Accept": "application/json" } }
                );
                const detail = await detailRes.json();
                if (detail && detail.Name) {
                    passes.push({
                        Id: item.id,
                        Name: detail.Name,
                        Price: detail.PriceInRobux || 0,
                    });
                }
            } catch(e) {
                console.error("detail error:", e.message);
            }
        }

        res.json({ 
            passes,
            nextPageCursor: listData.nextPageCursor || null
        });

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
