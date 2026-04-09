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
            return res.json({ passes: [], debug: "listData empty", listData });
        }

        const detailRes = await fetch(
            `https://catalog.roblox.com/v1/catalog/items/details`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    items: listData.data.map(item => ({
                        itemType: "Asset",
                        id: item.id
                    }))
                })
            }
        );
        const detailData = await detailRes.json();

        // debug
        res.json({ 
            listData,
            detailData,
        });

    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
