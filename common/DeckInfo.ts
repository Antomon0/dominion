export interface DeckInfo {
    cards: CardInfo[];
}

export interface CardInfo {
    isCommander: boolean;
    name: string;
    types: string;
    images: string[];
}
