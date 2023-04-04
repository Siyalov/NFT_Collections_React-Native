export interface NFTUserCollection {
    creator_name:   string;
    creator_pic:    string;
    collection_url: string;
    description:    string;
    items:          NFTUserCollectionItem[];
    id:             string;
}

export interface NFTUserCollectionItem {
    name:      string;
    price_eth: number;
    price_usd: number;
    image:     string;
    item_url:  string;
}
