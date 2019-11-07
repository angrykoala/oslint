export enum InsightFeel {
    positive = "positive",
    negative = "negative",
    neutral = "neutral",
    hidden = "hidden",
    warning = "warning",
}

export enum InsightType {
    text = "text"
}

export interface SerializedInsight {
    id: string;
    section: string;
    type: InsightType;
    title: string;
    text: string;
    feel: InsightFeel;
    links?: Array<string>;
}

export type PartialInsight = Pick<SerializedInsight,"text" | "feel" | "links">;
