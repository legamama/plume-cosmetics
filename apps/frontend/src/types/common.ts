export interface Testimonial {
    id: string;
    name: string;
    age: number;
    location: string;
    content: string;
    product: string;
    avatar?: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}
