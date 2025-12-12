import {
    Gift,
    Sparkles,
    Leaf,
    FlaskConical,
    Star,
    LucideProps
} from 'lucide-react';

export type IconName = 'gift' | 'sparkles' | 'leaf' | 'flask' | 'star';

const icons: Record<IconName, React.ComponentType<LucideProps>> = {
    gift: Gift,
    sparkles: Sparkles,
    leaf: Leaf,
    flask: FlaskConical,
    star: Star,
};

interface IconProps extends LucideProps {
    name: string; // allow string to support dynamic names from config
}

export function Icon({ name, ...props }: IconProps) {
    const IconComponent = icons[name as IconName];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in icon set.`);
        return null;
    }

    return <IconComponent {...props} />;
}
